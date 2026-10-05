'use client'
import { useState } from "react";

export default function UserProfile() {
    const [user, setUser] = useState({
        name: 'Alex',
        skills: ['JavaScript', 'React']
    });

    const [newSkill, setNewSkill] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');

    // Explicit function to update a skill name by index
    const updateSkillName = (indexToUpdate: any, newSkillName: any) => {
        setUser(prevUser => ({
            ...prevUser, // 1. Copy the parent object
            skills: prevUser.skills.map((skill, index) =>
                index === indexToUpdate ? newSkillName : skill // 2. Replace target skill, keep rest
            )
        }));
    };

    // Handler to start inline editing
    const startEditing = (index: any, currentName: any) => {
        setEditingIndex(index);
        setEditValue(currentName);
    };

    // Handler to save the updated name
    const handleSaveUpdate = (index: any) => {
        if (!editValue.trim()) return;
        updateSkillName(index, editValue);
        setEditingIndex(null);
        setEditValue('');
    };

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;
        setUser(prevUser => ({
            ...prevUser,
            skills: [...prevUser.skills, newSkill]
        }));
        setNewSkill('');
    };

    const handleRemoveSkill = (indexToRemove: any) => {
        setUser(prevUser => ({
            ...prevUser,
            skills: prevUser.skills.filter((_, index) => index !== indexToRemove)
        }));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>User: {user.name}</h2>

            <h3>Skills:</h3>
            <ul>
                {user.skills.map((skill, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                        {editingIndex === index ? (
                            /* Edit Mode */
                            <>
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                />
                                <button
                                    onClick={() => handleSaveUpdate(index)}
                                    style={{ marginLeft: '8px' }}
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingIndex(null)}
                                    style={{ marginLeft: '4px' }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            /* View Mode */
                            <>
                                <span style={{ marginRight: '12px' }}>{skill}</span>
                                <button onClick={() => startEditing(index, skill)}>
                                    Edit Name
                                </button>
                                <button
                                    onClick={() => handleRemoveSkill(index)}
                                    style={{ marginLeft: '4px', color: 'red' }}
                                >
                                    Remove
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: '16px' }}>
                <input
                    type="text"
                    placeholder="Add a new skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                />
                <button onClick={handleAddSkill} style={{ marginLeft: '8px' }}>
                    Add Skill
                </button>
            </div>
        </div>
    );
}