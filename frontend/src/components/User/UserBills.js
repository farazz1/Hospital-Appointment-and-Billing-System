import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserBills.css';

const UserBills = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const bills = [
    {
      id: 'Ishi-1235132500150',
      description: 'Consultation • Dr Sarah Johnson',
      date: '10/29/2025',
      amount: '$150',
      status: 'Pending'
    }
  ];

  const handlePayNow = (billId) => {
    console.log('Paying bill:', billId);
  };

  return (
    <div className="user-bills">
      <header className="bills-header">
        <div className="header-content">
          <h1>Healthcare Management System</h1>
          <div className="user-menu">
            <div className="user-profile" onClick={() => navigate('/user-dashboard')}>
              <div className="user-avatar">JD</div>
              <div className="user-details">
                <span className="user-name">John Doe</span>
                <span className="user-email">JohnDoe@gmail.com</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="bills-container">
        <div className="bills-card">
          <h1>Medical Bills</h1>
          <p className="bills-subtitle">View and pay your medical bills</p>

          <div className="bills-table-container">
            <table className="bills-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="bill-id">{bill.id}</td>
                    <td>{bill.description}</td>
                    <td>{bill.date}</td>
                    <td className="amount">{bill.amount}</td>
                    <td>
                      <span className={`status ${bill.status.toLowerCase()}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="pay-btn"
                        onClick={() => handlePayNow(bill.id)}
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="payment-summary">
            <h2>Payment Summary</h2>
            <div className="summary-card">
              <h3>Pending Bills:</h3>
              <div className="total-amount">
                <span>Total Amount Due:</span>
                <span className="amount">$150</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBills;