// Mock data for development - replace with actual API calls
const mockAppointments = [
  {
    id: 1,
    patientName: "John Smith",
    age: 45,
    gender: "Male",
    patientId: "P001",
    date: "Sat, Oct 25, 2025",
    time: "10:00 AM",
    reason: "Regular Checkup",
    status: "scheduled"
  },
  {
    id: 2,
    patientName: "Emily Davis",
    age: 32,
    gender: "Female",
    patientId: "P002",
    date: "Mon, Oct 27, 2025",
    time: "2:30 PM",
    reason: "Follow-up Visit",
    status: "scheduled"
  },
  {
    id: 3,
    patientName: "Michael Brown",
    age: 58,
    gender: "Male",
    patientId: "P003",
    date: "Tue, Oct 28, 2025",
    time: "11:15 AM",
    reason: "Consultation",
    status: "scheduled"
  }
];

const mockPatients = [
  {
    id: 1,
    name: "John Smith",
    age: 45,
    gender: "Male",
    patientId: "P001",
    phone: "+1234567890",
    email: "john.smith@email.com",
    address: "123 Main St, City, State"
  },
  {
    id: 2,
    name: "Emily Davis",
    age: 32,
    gender: "Female", 
    patientId: "P002",
    phone: "+1234567891",
    email: "emily.davis@email.com",
    address: "456 Oak Ave, City, State"
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentAPI = {
  getAll: async () => {
    await delay(500);
    return { data: mockAppointments };
  },
  
  markCompleted: async (id) => {
    await delay(300);
    const appointment = mockAppointments.find(apt => apt.id === id);
    if (appointment) {
      appointment.status = "completed";
    }
    return { data: appointment };
  }
};

export const patientAPI = {
  getAll: async () => {
    await delay(500);
    return { data: mockPatients };
  },
  
  create: async (patientData) => {
    await delay(300);
    const newPatient = {
      id: mockPatients.length + 1,
      ...patientData,
      patientId: `P00${mockPatients.length + 1}`
    };
    mockPatients.push(newPatient);
    return { data: newPatient };
  }
};

export const prescriptionAPI = {
  create: async (prescriptionData) => {
    await delay(300);
    return { data: { id: Date.now(), ...prescriptionData } };
  }
};