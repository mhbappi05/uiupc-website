// pages/Members.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import MemberCard from '../components/MemberCard';
import ExecutiveCommittee from '../components/ExecutiveCommittee';
import PreviousCommittee from '../components/PreviousCommittee';
import Loading from '../components/Loading';
import './Members.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [currentCommittee, setCurrentCommittee] = useState([]);
  const [previousCommittees, setPreviousCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    fetchMembers();
    loadCommitteeData();
  }, []);

  const fetchMembers = async () => {
    try {
      // For demo purposes, using static data. Replace with Firebase in production
      const demoMembers = [
        {
          id: 1,
          name: "Sarah Johnson",
          department: "Computer Science & Engineering",
          profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
          role: "Photographer",
          social: {
            facebook: "https://facebook.com/sarahjohnson",
            instagram: "https://instagram.com/sarahjohnson"
          }
        },
        {
          id: 2,
          name: "Mike Chen",
          department: "Electrical Engineering",
          profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
          role: "Videographer",
          social: {
            instagram: "https://instagram.com/mikechen",
            portfolio: "https://mikechen.com"
          }
        },
        {
          id: 3,
          name: "Emily Davis",
          department: "Business Administration",
          profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
          role: "Event Coordinator",
          social: {
            facebook: "https://facebook.com/emilydavis",
            linkedin: "https://linkedin.com/in/emilydavis"
          }
        },
        {
          id: 4,
          name: "Alex Rodriguez",
          department: "Architecture",
          profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
          role: "Portrait Specialist",
          social: {
            instagram: "https://instagram.com/alexrodriguez",
            behance: "https://behance.net/alexrodriguez"
          }
        },
        {
          id: 5,
          name: "Jessica Wang",
          department: "Graphic Design",
          profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
          role: "Creative Director",
          social: {
            instagram: "https://instagram.com/jessicawang",
            portfolio: "https://jessicawang.design"
          }
        },
        {
          id: 6,
          name: "David Kim",
          department: "Film Studies",
          profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
          role: "Cinematographer",
          social: {
            youtube: "https://youtube.com/davidkim",
            instagram: "https://instagram.com/davidkim"
          }
        }
      ];
      
      setMembers(demoMembers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching members:", error);
      setLoading(false);
    }
  };

  const loadCommitteeData = () => {
    // Current Executive Committee 2024 with real image links
    const currentExecutives = [
      {
        id: 1,
        name: "Pulok Sikder",
        role: "President",
        department: "Computer Science & Engineering",
        profileImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop&crop=face",
        social: {
          facebook: "https://facebook.com/puloksikder",
          instagram: "https://instagram.com/puloksikder",
        }
      },
      {
        id: 2,
        name: "Nafis Nawal",
        role: "Vice President",
        department: "Computer Science & Engineering",
        profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
        social: {
          facebook: "https://facebook.com/nafisnawal",
          instagram: "https://instagram.com/nafisnawal"
        }
      },
      {
        id: 3,
        name: "Md Mahmudul Hasan",
        role: "General Secretary",
        department: "Computer Science & Engineering",
        profileImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&h=300&fit=crop&crop=face",
        social: {
          facebook: "https://facebook.com/mahmudulhasan",
          linkedin: "https://linkedin.com/in/mahmudulhasan",
          portfolio: "https://mahmudulhasan.com"
        }
      },
      {
        id: 4,
        name: "Ahmad Hasan",
        role: "Ass. General Secretary",
        department: "Computer Science & Engineering",
        profileImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=300&h=300&fit=crop&crop=face",
        social: {
          facebook: "https://facebook.com/ahmadhasan",
          instagram: "https://instagram.com/ahmadhasan"
        }
      },
      {
        id: 5,
        name: "Muhit Khan",
        role: "Treasurer",
        department: "Computer Science & Engineering",
        profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
        social: {
          facebook: "https://facebook.com/muhitkhan",
          instagram: "https://instagram.com/muhitkhan"
        }
      },
      {
        id: 6,
        name: "Anika Anjum Mona",
        role: "Ass. Treasurer",
        department: "Environmental Science",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
        social: {
          facebook: "https://facebook.com/anikamona",
          instagram: "https://instagram.com/anikamona"
        }
      }
    ];

    // Previous Committees with more detailed data
    const previousExecutives = [
      {
        year: "2023",
        members: [
          { 
            name: "Alex Thompson", 
            role: "President", 
            department: "Computer Science & Engineering",
            profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          },
          { 
            name: "Maria Garcia", 
            role: "Vice President", 
            department: "Electrical & Electronic Engineering",
            profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
          },
          { 
            name: "James Wilson", 
            role: "General Secretary", 
            department: "Business Administration",
            profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          },
          { 
            name: "Lisa Brown", 
            role: "Treasurer", 
            department: "Economics",
            profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
          }
        ]
      },
      {
        year: "2022",
        members: [
          { 
            name: "Robert Davis", 
            role: "President", 
            department: "Computer Science & Engineering",
            profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
          },
          { 
            name: "Sarah Miller", 
            role: "Vice President", 
            department: "Pharmacy",
            profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
          },
          { 
            name: "Kevin Lee", 
            role: "Secretary", 
            department: "Economics",
            profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face"
          }
        ]
      },
      {
        year: "2021",
        members: [
          { 
            name: "Michael Brown", 
            role: "President", 
            department: "Architecture",
            profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
          },
          { 
            name: "Jennifer Wilson", 
            role: "Vice President", 
            department: "English Literature",
            profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
          },
          { 
            name: "Chris Taylor", 
            role: "Secretary", 
            department: "Law",
            profileImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face"
          }
        ]
      }
    ];

    setCurrentCommittee(currentExecutives);
    setPreviousCommittees(previousExecutives);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="members-page">
      <div className="container">
        {/* Executive Committee Section */}
        <section className="executive-section">
          <div className="section-header">
            <h2>Executive Committee 2024</h2>
            <p>The dedicated team leading our photography community</p>
            <div className="section-divider"></div>
          </div>
          
          <ExecutiveCommittee members={currentCommittee} />
        </section>

        {/* Tab Navigation */}
        <section className="members-tabs-section">
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
                onClick={() => setActiveTab('current')}
              >
                Current Members
              </button>
              <button 
                className={`tab-button ${activeTab === 'previous' ? 'active' : ''}`}
                onClick={() => setActiveTab('previous')}
              >
                Previous Committees
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'current' ? (
                <div className="current-members">
                  <div className="members-grid">
                    {members.map(member => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </div>
                  
                  {members.length === 0 && (
                    <div className="no-members">
                      <div className="no-members-icon">📸</div>
                      <h3>No Members Yet</h3>
                      <p>Be the first to join our photography community!</p>
                    </div>
                  )}
                </div>
              ) : (
                <PreviousCommittee committees={previousCommittees} />
              )}
            </div>
          </div>
        </section>

        {/* Join CTA Section */}
        <section className="join-cta-section">
          <div className="cta-content">
            <h2>Want to Join Our Community?</h2>
            <p>Become part of UIU's vibrant photography family and showcase your talent</p>
            <button className="btn-primary cta-button">
              Join Photography Club
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Members;