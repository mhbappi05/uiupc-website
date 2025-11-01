// components/MemberCard.js
import React from 'react';
import './MemberCard.css';

const MemberCard = ({ member }) => {
  return (
    <div className="member-card">
      <div className="member-image">
        <img 
          src={member.profileImage || '/default-avatar.png'} 
          alt={member.name}
        />
        {member.role === 'President' && (
          <span className="role-badge president">President</span>
        )}
        {member.role === 'General Secretary' && (
          <span className="role-badge secretary">Secretary</span>
        )}
      </div>
      
      <div className="member-info">
        <h3>{member.name}</h3>
        <p className="member-role">{member.role}</p>
        <p className="member-department">{member.department}</p>
        
        {member.bio && (
          <p className="member-bio">{member.bio.substring(0, 100)}...</p>
        )}
        
        <div className="member-social">
          {member.instagram && (
            <a href={member.instagram} target="_blank" rel="noopener noreferrer">
              📷
            </a>
          )}
          {member.behance && (
            <a href={member.behance} target="_blank" rel="noopener noreferrer">
              🎨
            </a>
          )}
          {member.portfolio && (
            <a href={member.portfolio} target="_blank" rel="noopener noreferrer">
              🌐
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;