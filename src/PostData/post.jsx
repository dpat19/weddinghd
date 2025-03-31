import React from "react";
import { db } from "../../firebase"; // Adjust the path as needed
import { doc, setDoc } from "firebase/firestore";

const PostDatas = () => {
  const handlePostData = async () => {
    try {
      // 1. Write a Family Document to the "families" collection
      const familyId = "fam001"; // Unique family ID
      await setDoc(doc(db, "families", familyId), {
        name: "Doe Family",
        accessCode: "1112", // Unique access code for family access
        members: ["guest123", "guest789", "guest456"],
      });
      console.log("Family document written");

      // 2. Write a User Document to the "users" collection
      await setDoc(doc(db, "users", "guest123"), {
        name: "Dhruv Patel",
        email: "",
        phone: "+732-789-5802",
        familyId: familyId,
        events: ["event001", "event002", "event003", "event004"],
        rsvp: {
          HernishaMehndi: "Going",
          HernishaPithi: "Not Going",
          event003: "Maybe",
          event004: "Going",
        },
      });
      console.log("User document written");

      // 3. Write 4 Event Documents to the "events" collection
      const events = [
        {
          id: "HernishaMehndi",
          title: "Hernisha's Mehndi",
          date: "Wednesday May 6, 2026 at 6:00 PM",
          location: "Hernisha's Home",
          invited: ["guest123", "guest789", "guest456"],
          rsvpList: {
            guest123: "Going",
            guest789: "Maybe",
            guest456: "Not Going",
          },
        },
        {
          id: "HernishaPithi",
          title: "Hernisha's Pithi",
          date: "Thursday May 7, 2026 at 9:00 AM",
          location: "Venue B",
          invited: ["guest123", "guest789", "guest456"],
          rsvpList: {
            guest123: "Going",
            guest789: "Maybe",
            guest456: "Not Going",
          },
        },
        {
          id: "DhruvPithi",
          title: "Dhruv's Pithi",
          date: "Thursday May 7, 2026 at 6:00 PM",
          location: "BAPS Swaminarayan Mandir",
          invited: ["guest123", "guest789", "guest456"],
          rsvpList: {
            guest123: "Maybe",
            guest789: "Maybe",
            guest456: "Not Going",
          },
        },
        {
          id: "Sangeet",
          title: "Sangeet",
          date: "Friday May 8, 2026 at 5:45 PM",
          location: "LBI National Golf & Resort",
          invited: ["guest123", "guest789", "guest456"],
          rsvpList: {
            guest123: "Going",
            guest789: "Going",
            guest456: "Not Going",
          },
        },
        {
            id: "WeddingCeremony",
            title: "Wedding Ceremony",
            date: "Saturday May 9, 2026 at 10:0 AM",
            location: "LBI National Golf & Resort",
            invited: ["guest123", "guest789", "guest456"],
            rsvpList: {
              guest123: "Going",
              guest789: "Going",
              guest456: "Not Going",
            },
          },
          {
            id: "AfterParty",
            title: "After Party",
            date: "Saturday May 9, 2026 at 7:00 PM",
            location: "LBI National Golf & Resort",
            invited: ["guest123", "guest789", "guest456"],
            rsvpList: {
              guest123: "Going",
              guest789: "Going",
              guest456: "Not Going",
            },
          },
      ];

      for (const event of events) {
        await setDoc(doc(db, "events", event.id), event);
        console.log(`Event ${event.id} document written`);
      }

      console.log("All sample data posted successfully!");
      alert("Sample data posted successfully!");
    } catch (error) {
      console.error("Error posting sample data:", error);
      alert("Error posting sample data. Check console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button onClick={handlePostData}>Post Sample Data</button>
    </div>
  );
};

export default PostDatas;
