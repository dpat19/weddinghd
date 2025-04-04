import React, { useState } from "react";
import Papa from "papaparse";
import { db } from "../../firebase"; // Adjust the path as needed
import { doc, setDoc } from "firebase/firestore";

const CsvUploader = () => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file input change and parse CSV data
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Assumes CSV file has a header row
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Parsed CSV data:", results.data);
          setCsvData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  // Helper to generate a random access code (e.g., a 6-character alphanumeric code)
  const generateRandomAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Upload parsed CSV data to Firestore: users, families, and events
  const handleUploadToFirebase = async () => {
    if (csvData.length === 0) {
      alert("No CSV data loaded!");
      return;
    }

    setLoading(true);
    try {
      // Process CSV data into user objects.
      // CSV headers: id, name, email, phone, familyId, events, rsvp
      const users = csvData.map((row) => {
        // Convert events field to an array (if provided)
        let eventsArray = row.events
          ? row.events.split(",").map((s) => s.trim())
          : [];
        // Parse the rsvp field as JSON (if provided)
        let rsvpObj = {};
        if (row.rsvp) {
          try {
            rsvpObj = JSON.parse(row.rsvp);
          } catch (err) {
            console.warn("Could not parse rsvp as JSON for row:", row, err);
          }
        }
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          familyId: row.familyId,
          events: eventsArray,
          rsvp: rsvpObj,
        };
      });

      // Build families map from users.
      // Each key is a familyId and the value is an array of user IDs.
      const familiesMap = {};
      users.forEach((user) => {
        if (user.familyId) {
          if (familiesMap[user.familyId]) {
            familiesMap[user.familyId].push(user.id);
          } else {
            familiesMap[user.familyId] = [user.id];
          }
        }
      });

      // Upload each user document to the "users" collection.
      for (const user of users) {
        await setDoc(doc(db, "users", user.id), user);
        console.log(`User ${user.id} uploaded.`);
      }

      // Upload family documents: assign a random access code, and include members.
      for (const familyId in familiesMap) {
        const accessCode = generateRandomAccessCode();
        await setDoc(doc(db, "families", familyId), {
          accessCode,
          members: familiesMap[familyId],
        });
        console.log(`Family ${familyId} uploaded with access code ${accessCode}.`);
      }

      // Build an events map based on user data.
      // For each event id found in user.events, add the user to the invited list and record their rsvp.
      const eventsMap = {};
      users.forEach((user) => {
        user.events.forEach((eventId) => {
          if (!eventsMap[eventId]) {
            eventsMap[eventId] = {
              invited: [],
              rsvpList: {},
            };
          }
          // Add the user if not already added.
          if (!eventsMap[eventId].invited.includes(user.id)) {
            eventsMap[eventId].invited.push(user.id);
          }
          eventsMap[eventId].rsvpList[user.id] = user.rsvp[eventId] || "Pending";
        });
      });

      // Upload event documents to the "events" collection.
      // If you want to include additional details (e.g., title, date, location), you can adjust accordingly.
      for (const eventId in eventsMap) {
        // Using default/dummy details for events; you could also extend your CSV to include these.
        const eventDoc = {
          title: `Event ${eventId}`,
          invited: eventsMap[eventId].invited,
          rsvpList: eventsMap[eventId].rsvpList,
        };
        await setDoc(doc(db, "events", eventId), eventDoc);
        console.log(`Event ${eventId} document written`);
      }

      alert("CSV data uploaded successfully!");
      setCsvData([]); // Clear CSV data if needed
    } catch (error) {
      console.error("Error uploading CSV data:", error);
      alert("Error uploading CSV data. Check console for details.");
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Upload CSV Data for Users</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <br />
      <button
        onClick={handleUploadToFirebase}
        disabled={loading || csvData.length === 0}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        {loading ? "Uploading..." : "Upload Data"}
      </button>
    </div>
  );
};

export default CsvUploader;
