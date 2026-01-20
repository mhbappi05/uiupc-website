// pages/Committee2026.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../components/Loading";
import "./Committee2026.css";

const Committee2026 = () => {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize state with all sections
  const [revealedSections, setRevealedSections] = useState({
    core: {
      president: false,
      generalSecretary: false,
      assistantGeneralSecretary: false,
      treasurer: false,
    },
    publicrelations: { head: false, assistantHead: true },
    organizers: { head: false, assistantHead: true },
    event: { head: false, assistantHead: true },
    humanresources: { head: false, assistantHead: true },
    designers: { head: false, assistantHead: true },
    executives: { head: true, assistantHead: true },
  });

  // Committee 2026 Data
  const committee2026 = [
    // Core Team
    {
      id: 1,
      name: "Anika Anjum Mona",
      role: "President",
      department: "Environment and Development Studies",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983044/mona_y54t2k.jpg",
      tag: "Core",
      positionType: "president",
    },
    {
      id: 2,
      name: "Ahmad Hasan",
      role: "General Secretary",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983042/ahmad_enzaam.jpg",
      tag: "Core",
      positionType: "generalSecretary",
    },
    {
      id: 3,
      name: "Minhaz Hossain Shemul",
      role: "Assistant General Secretary",
      department: "Electrical & Electronic Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983044/shemul_o2n1am.jpg",
      tag: "Core",
      positionType: "assistantGeneralSecretary",
    },
    {
      id: 4,
      name: "Mayesha Nur",
      role: "Treasurer",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983044/maisha_eawkws.jpg",
      tag: "Core",
      positionType: "treasurer",
    },

    // Public Relations Team
    {
      id: 5,
      name: "Rifat Hassan Rabib",
      role: "Head of PR",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983041/rabib_dzpawf.jpg",
      tag: "Public Relations",
      positionType: "head",
    },
    {
      id: 15,
      name: "Zannatul Amin",
      role: "Asst. Head of PR",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983042/anika_anssy2.jpg",
      tag: "Public Relations",
      positionType: "assistantHead",
    },
    {
      id: 6,
      name: "Jahid Hasan Sabbir",
      role: "Asst. Head of PR",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983043/sabbir_tdtnke.jpg",
      tag: "Public Relations",
      positionType: "assistantHead",
    },
    {
      id: 7,
      name: "Tahsin Moin Rhythm",
      role: "Asst. Head of PR",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983043/sabbir_tdtnke.jpg",
      tag: "Public Relations",
      positionType: "assistantHead",
    },

    // Organizers Team
    {
      id: 8,
      name: "Tanvir Ahmed",
      role: "Head of ORG",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983044/tanvir_cuzdid.jpg",
      tag: "Organizers",
      positionType: "head",
    },
    {
      id: 9,
      name: "Arean Nobi",
      role: "Asst. Head of Org",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983041/arean_ubnwpt.jpg",
      tag: "Organizers",
      positionType: "assistantHead",
    },
    {
      id: 10,
      name: "Md. Eakub Ali",
      role: "Asst. Head of Org",
      department: "Electrical & Electronic Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983041/arean_ubnwpt.jpg",
      tag: "Organizers",
      positionType: "assistantHead",
    },

    // Event Team
    {
      id: 11,
      name: "Dipto Mahdud Sultan",
      role: "Head of Event",
      department: "Department of MSJ",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983041/dipto_yxckvv.jpg",
      tag: "Event",
      positionType: "head",
    },
    {
      id: 12,
      name: "Rifat Hassan Rabib",
      role: "Asst. Head of Event",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983041/rabib_dzpawf.jpg",
      tag: "Event",
      positionType: "assistantHead",
    },
    {
      id: 13,
      name: "Tanzim Hasan",
      role: "Asst. Head of Event",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983041/rabib_dzpawf.jpg",
      tag: "Event",
      positionType: "assistantHead",
    },

    // Human Resources Team
    {
      id: 14,
      name: "Md Zobaer Ahmed",
      role: "Head of HR",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983045/zobayer_rztaox.jpg",
      tag: "Human Resources",
      positionType: "head",
    },
    {
      id: 15,
      name: "Pratoy Barua",
      role: "Asst. Head of HR",
      department: "Environment and Development Studies",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      tag: "Human Resources",
      positionType: "assistantHead",
    },
    {
      id: 15,
      name: "Mahin Muntasin Rahul",
      role: "Asst. Head of HR",
      department: "Environment and Development Studies",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      tag: "Human Resources",
      positionType: "assistantHead",
    },
    {
      id: 16,
      name: "Md Abdul Aziz Arafat",
      role: "Asst. Head of HR",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      tag: "Human Resources",
      positionType: "assistantHead",
    },

    // Designers Team
    {
      id: 17,
      name: "Jonayed",
      role: "Head of Design",
      department: "Computer Science & Engineering",
      profileImage: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1761983043/Jonayed_ozbke5.jpg",
      tag: "Designers",
      positionType: "head",
    },
    {
      id: 18,
      name: "Md Abdul Aziz Arafat",
      role: "Asst. Head of Design",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      tag: "Designers",
      positionType: "assistantHead",
    },

    // Executives Team
    {
      id: 19,
      name: "Abdullah R Rafi",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 20,
      name: "Yeasin Arafat Babu",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 21,
      name: "S.M. Atik Hasan",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 22,
      name: "Fahmid Khan",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 23,
      name: "Million Kuthial",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 24,
      name: "Tanzin Tuli",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 25,
      name: "Murad Hasan",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 26,
      name: "Ameenah Binte Mahbub",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 27,
      name: "Sadman Saleh",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 28,
      name: "Sadika Salam",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 29,
      name: "Nusrat Subha",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 30,
      name: "Siam Arefin",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
    {
      id: 31,
      name: "Faysal Bin Ibrahim",
      role: "Executive Member",
      department: "Computer Science & Engineering",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      tag: "Executives",
      positionType: "executive",
    },
  ];

  // Get unique tags
  const tags = ["all", ...new Set(committee2026.map((member) => member.tag))];

  // Fixed toggleReveal function
  const toggleReveal = (section, position, isCore = false) => {
    setRevealedSections((prev) => {
      if (isCore) {
        // For Core team: turn off all others, turn on this one
        const newCoreState = {
          president: false,
          generalSecretary: false,
          assistantGeneralSecretary: false,
          treasurer: false,
        };
        newCoreState[position] = !prev.core[position]; // Toggle the clicked position

        // If we're turning it off, leave all off
        if (!newCoreState[position]) {
          // Keep all false (already set)
        }

        return {
          ...prev,
          core: newCoreState,
        };
      } else {
        // For other teams: toggle individual position
        const sectionKey = section.toLowerCase().replace(/\s+/g, "");
        return {
          ...prev,
          [sectionKey]: {
            ...prev[sectionKey],
            [position]: !prev[sectionKey][position],
          },
        };
      }
    });
  };

  const getFilteredMembers = () => {
    if (activeFilter === "all") {
      return committee2026;
    }

    const members = committee2026.filter(
      (member) => member.tag === activeFilter,
    );

    if (activeFilter === "Core") {
      // For Core team, only show if revealed
      return members.filter((member) => {
        return revealedSections.core[member.positionType];
      });
    } else if (activeFilter === "Executives") {
      // Executives always visible
      return members;
    } else {
      // For other teams
      const sectionKey = activeFilter.toLowerCase().replace(/\s+/g, "");
      const sectionState = revealedSections[sectionKey] || {
        head: false,
        assistantHead: true,
      };

      return members.filter((member) => {
        if (member.positionType === "head") {
          return sectionState.head;
        }
        if (member.positionType === "assistantHead") {
          return sectionState.assistantHead;
        }
        return false;
      });
    }
  };

  // Initialize state when component mounts and when filter changes
  useEffect(() => {
    const sectionKey = activeFilter.toLowerCase().replace(/\s+/g, "");

    // Ensure section exists in state
    setRevealedSections((prev) => {
      const newState = { ...prev };

      // Initialize section if it doesn't exist
      if (
        activeFilter !== "all" &&
        activeFilter !== "Core" &&
        activeFilter !== "Executives"
      ) {
        if (!newState[sectionKey]) {
          newState[sectionKey] = { head: false, assistantHead: true };
        }
      }

      return newState;
    });
  }, [activeFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    document.body.style.overflow = "unset";
  };

  const getSectionTitle = (tag) => {
    const titles = {
      Core: "Core Team",
      "Public Relations": "PR Team",
      "Human Resources": "HR Team",
      Organizers: "Organizers Team",
      Event: "Event Team",
      Designers: "Design Team",
      Executives: "Executive Team",
    };
    return titles[tag] || tag;
  };

  // Simple Committee Card Component
  const CommitteeCard = ({ member, onClick }) => (
    <motion.div
      className="committee-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="committee-card-image">
        <img src={member.profileImage} alt={member.name} />
      </div>

      <div className="committee-card-content">
        <h3 className="committee-card-name">{member.name}</h3>
        <div className="committee-card-role">{member.role}</div>
        <div className="committee-card-department">{member.department}</div>

        <div className="committee-card-tag">{member.tag}</div>
      </div>
    </motion.div>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="committee-2026-page">
      {/* Animated Background Elements */}
      <div className="floating-elements">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="floating-element"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${Math.random() * 40 + 10}px`,
              height: `${Math.random() * 40 + 10}px`,
              background: `rgba(255, 107, 0, ${Math.random() * 0.1 + 0.05})`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="badge">NEW</div>
            <h1 className="hero-title">
              <span className="gradient-text">Committee 2026</span>
              <br />
              The Next Generation
            </h1>
            <p className="hero-subtitle">
              Meet the passionate leaders who will shape the future of UIU
              Photography Club. A diverse team of innovators, creators, and
              visionaries ready to capture moments that matter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-container">
            <h3 className="filter-title">Filter by Department</h3>
            <div className="filter-tags">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-tag ${activeFilter === tag ? "active" : ""}`}
                  onClick={() => setActiveFilter(tag)}
                >
                  {tag === "all" ? "All Members" : getSectionTitle(tag)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Committee Grid Section */}
      <section className="committee-grid-section">
        <div className="container">
          {activeFilter === "all" ? (
            // Show all members
            <AnimatePresence mode="wait">
              <motion.div
                key="all"
                className="committee-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {committee2026.map((member, index) => (
                  <div key={member.id} className="committee-card-wrapper">
                    <CommitteeCard
                      member={member}
                      onClick={() => handleMemberClick(member)}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            // Show filtered members with reveal buttons
            <div className="filtered-section-container">
              <div className="section-header">
                <h2 className="section-title-main">
                  {getSectionTitle(activeFilter)}
                  <span className="section-subtitle">
                    {activeFilter === "Core"
                      ? "Click buttons to reveal team members (only one at a time)"
                      : activeFilter === "Executives"
                        ? "Executive members are always visible"
                        : "Assistant Heads visible by default. Click to reveal Head."}
                  </span>
                </h2>
              </div>

              <div className="section-description">
                <p>
                  {activeFilter === "Core"
                    ? "Each Core position must be revealed individually. Only one can be visible at a time."
                    : activeFilter === "Executives"
                      ? "The Executive Team provides strategic oversight and guidance."
                      : `The ${activeFilter} Team manages specific aspects of club operations.`}
                </p>
              </div>

              {/* Core Team Individual Reveal Buttons */}
              {activeFilter === "Core" && (
                <div className="core-reveal-section">
                  <h3 className="reveal-section-title">
                    Reveal Core Team Positions:
                  </h3>
                  <div className="reveal-buttons-grid">
                    <button
                      className={`reveal-position-btn ${revealedSections.core.assistantGeneralSecretary ? "active" : ""}`}
                      onClick={() =>
                        toggleReveal("core", "assistantGeneralSecretary", true)
                      }
                    >
                      {revealedSections.core.assistantGeneralSecretary
                        ? "✓ Assistant General Secretary"
                        : "Reveal Assistant General Secretary"}
                    </button>
                    <button
                      className={`reveal-position-btn ${revealedSections.core.treasurer ? "active" : ""}`}
                      onClick={() => toggleReveal("core", "treasurer", true)}
                    >
                      {revealedSections.core.treasurer
                        ? "✓ Treasurer"
                        : "Reveal Treasurer"}
                    </button>
                    <button
                      className={`reveal-position-btn ${revealedSections.core.generalSecretary ? "active" : ""}`}
                      onClick={() =>
                        toggleReveal("core", "generalSecretary", true)
                      }
                    >
                      {revealedSections.core.generalSecretary
                        ? "✓ General Secretary"
                        : "Reveal General Secretary"}
                    </button>
                    <button
                      className={`reveal-position-btn ${revealedSections.core.president ? "active" : ""}`}
                      onClick={() => toggleReveal("core", "president", true)}
                    >
                      {revealedSections.core.president
                        ? "✓ President"
                        : "Reveal President"}
                    </button>
                  </div>
                </div>
              )}

              {/* For other teams (not Core or Executives) */}
              {activeFilter !== "Core" && activeFilter !== "Executives" && (
                <div className="team-reveal-section">
                  <h3 className="reveal-section-title">Reveal Team Members:</h3>
                  <div className="reveal-buttons-row">
                    <div className="reveal-status">
                      <span className={`status-indicator active`}>
                        Assistant Head: Visible
                      </span>
                    </div>
                    <button
                      className={`reveal-head-btn ${revealedSections[activeFilter.toLowerCase().replace(/\s+/g, "")]?.head ? "active" : ""}`}
                      onClick={() => toggleReveal(activeFilter, "head")}
                    >
                      {revealedSections[
                        activeFilter.toLowerCase().replace(/\s+/g, "")
                      ]?.head
                        ? "✓ Head Revealed"
                        : "Reveal Head"}
                    </button>
                  </div>
                </div>
              )}

              {/* Committee Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter + "-members"}
                  className="committee-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {getFilteredMembers().map((member) => (
                    <div key={member.id} className="committee-card-wrapper">
                      <CommitteeCard
                        member={member}
                        onClick={() => handleMemberClick(member)}
                      />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Empty state message */}
              {getFilteredMembers().length === 0 && (
                <div className="empty-state">
                  <p>
                    No members revealed yet. Click the buttons above to reveal
                    team members.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Simplified Member Modal */}
      <AnimatePresence>
        {isModalOpen && selectedMember && (
          <motion.div
            className="member-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="member-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>

              <div className="modal-member-header">
                <img
                  src={selectedMember.profileImage}
                  alt={selectedMember.name}
                  className="modal-member-image"
                />
                <div className="modal-member-info">
                  <h3 className="modal-member-name">{selectedMember.name}</h3>
                  <div className="modal-member-role">{selectedMember.role}</div>
                  <div className="modal-member-department">
                    {selectedMember.department}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Committee2026;
