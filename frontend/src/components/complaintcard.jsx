const ComplaintCard = ({ complaint }) => {
    const statusColor = {
        'Pending': '#f39c12',
        'In Progress': '#3498db',
        'Resolved': '#27ae60'
    };

    return (
        <div style={{ 
            borderLeft: `5px solid ${statusColor[complaint.status]}`,
            padding: '15px', margin: '10px 0', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
        }}>
            <h4>{complaint.title}</h4>
            <p style={{ color: '#666' }}>{complaint.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Category: <b>{complaint.category}</b></span>
                <span style={{ color: statusColor[complaint.status] }}>● {complaint.status}</span>
            </div>
        </div>
    );
};
export default ComplaintCard;