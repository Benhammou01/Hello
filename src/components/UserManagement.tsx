import React, { useState } from 'react';
import styled from 'styled-components';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended' | 'pending';
  role: 'client' | 'vip' | 'blacklisted';
  joinDate: string;
  lastRental?: string;
  rentalHistory: number;
  licenseNumber: string;
  licenseExpiry: string;
  verificationStatus: 'verified' | 'unverified' | 'pending';
}

interface NewUser extends Omit<User, 'id' | 'joinDate' | 'rentalHistory'> {
  password: string;
  confirmPassword: string;
  address: string;
  dateOfBirth: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        status: 'active',
        role: 'client',
        joinDate: '2024-01-15',
        lastRental: '2024-02-20',
        rentalHistory: 5,
        licenseNumber: 'DL123456',
        licenseExpiry: '2025-01-15',
        verificationStatus: 'verified'
      },
      {
        id: '2',
        name: 'Sarah Smith',
        email: 'sarah@example.com',
        phone: '+1987654321',
        status: 'pending',
        role: 'vip',
        joinDate: '2024-02-01',
        rentalHistory: 12,
        licenseNumber: 'DL789012',
        licenseExpiry: '2024-12-31',
        verificationStatus: 'pending'
      }
    ];
  });

  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: 'pending',
    role: 'client',
    lastRental: undefined,
    licenseNumber: '',
    licenseExpiry: '',
    verificationStatus: 'pending',
    address: '',
    dateOfBirth: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended' | 'pending') => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleRoleChange = (userId: string, newRole: 'client' | 'vip' | 'blacklisted') => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleVerificationStatus = (userId: string, status: 'verified' | 'unverified' | 'pending') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, verificationStatus: status } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && user.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'suspended':
        return '#F44336';
      case 'pending':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'vip':
        return '#9C27B0';
      case 'blacklisted':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      status: 'pending',
      role: 'client',
      joinDate: new Date().toISOString(),
      rentalHistory: 0,
      licenseNumber: newUser.licenseNumber,
      licenseExpiry: newUser.licenseExpiry,
      verificationStatus: 'pending'
    };

    setUsers([...users, user]);
    setShowAddUser(false);
    // Reset form
    setNewUser({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      status: 'pending',
      role: 'client',
      lastRental: undefined,
      licenseNumber: '',
      licenseExpiry: '',
      verificationStatus: 'pending',
      address: '',
      dateOfBirth: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    });
  };

  const handleEditClick = (user: User) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;

    setUsers(users.map(user => 
      user.id === userToEdit.id ? userToEdit : user
    ));
    setShowEditModal(false);
    setUserToEdit(null);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    
    setUsers(users.filter(user => user.id !== userToDelete.id));
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  return (
    <Container>
      <Header>
        <div>
          <h2>User Management</h2>
          <SearchBar>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
        </div>
        <Controls>
          <FilterSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </FilterSelect>
          <AddButton onClick={() => setShowAddUser(true)}>
            <i className="fas fa-user-plus"></i> Add User
          </AddButton>
        </Controls>
      </Header>

      <UserGrid>
        {filteredUsers.map(user => (
          <UserCard key={user.id}>
            <UserHeader>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserInfo>
              <StatusBadge color={getStatusColor(user.status)}>
                {user.status}
              </StatusBadge>
            </UserHeader>

            <UserDetails>
              <DetailItem>
                <i className="fas fa-phone"></i>
                {user.phone}
              </DetailItem>
              <DetailItem>
                <i className="fas fa-calendar"></i>
                Joined: {new Date(user.joinDate).toLocaleDateString()}
              </DetailItem>
              <DetailItem>
                <i className="fas fa-car"></i>
                Rentals: {user.rentalHistory}
              </DetailItem>
              <DetailItem>
                <i className="fas fa-id-card"></i>
                License: {user.licenseNumber}
              </DetailItem>
              <DetailItem>
                <i className="fas fa-calendar-check"></i>
                License Expiry: {new Date(user.licenseExpiry).toLocaleDateString()}
              </DetailItem>
            </UserDetails>

            <UserActions>
              <ActionSelect
                value={user.status}
                onChange={(e) => handleStatusChange(user.id, e.target.value as 'active' | 'suspended' | 'pending')}
                color={getStatusColor(user.status)}
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </ActionSelect>

              <ActionSelect
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value as 'client' | 'vip' | 'blacklisted')}
                color={getRoleColor(user.role)}
              >
                <option value="client">Client</option>
                <option value="vip">VIP</option>
                <option value="blacklisted">Blacklisted</option>
              </ActionSelect>

              <VerificationButton
                status={user.verificationStatus}
                onClick={() => handleVerificationStatus(
                  user.id,
                  user.verificationStatus === 'verified' ? 'unverified' : 'verified'
                )}
              >
                <i className={`fas fa-${user.verificationStatus === 'verified' ? 'check-circle' : 'times-circle'}`}></i>
                {user.verificationStatus}
              </VerificationButton>
            </UserActions>

            <ActionButtons>
              <ActionButton color="#4CAF50" onClick={() => handleEditClick(user)}>
                <i className="fas fa-edit"></i> Edit
              </ActionButton>
              <ActionButton color="#F44336" onClick={() => handleDeleteClick(user)}>
                <i className="fas fa-trash"></i> Delete
              </ActionButton>
            </ActionButtons>
          </UserCard>
        ))}
      </UserGrid>

      {showAddUser && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Add New User</h3>
              <CloseButton onClick={() => setShowAddUser(false)}>
                <i className="fas fa-times"></i>
              </CloseButton>
            </ModalHeader>
            <Form onSubmit={handleAddUser}>
              <FormSection>
                <SectionTitle>Personal Information</SectionTitle>
                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={newUser.dateOfBirth}
                    onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Address</Label>
                  <Textarea
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    required
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Account Security</SectionTitle>
                <FormGroup>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                    required
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Driver's License Information</SectionTitle>
                <FormGroup>
                  <Label>License Number</Label>
                  <Input
                    type="text"
                    value={newUser.licenseNumber}
                    onChange={(e) => setNewUser({ ...newUser, licenseNumber: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>License Expiry Date</Label>
                  <Input
                    type="date"
                    value={newUser.licenseExpiry}
                    onChange={(e) => setNewUser({ ...newUser, licenseExpiry: e.target.value })}
                    required
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Emergency Contact</SectionTitle>
                <FormGroup>
                  <Label>Contact Name</Label>
                  <Input
                    type="text"
                    value={newUser.emergencyContact.name}
                    onChange={(e) => setNewUser({
                      ...newUser,
                      emergencyContact: { ...newUser.emergencyContact, name: e.target.value }
                    })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Contact Phone</Label>
                  <Input
                    type="tel"
                    value={newUser.emergencyContact.phone}
                    onChange={(e) => setNewUser({
                      ...newUser,
                      emergencyContact: { ...newUser.emergencyContact, phone: e.target.value }
                    })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Relationship</Label>
                  <Input
                    type="text"
                    value={newUser.emergencyContact.relationship}
                    onChange={(e) => setNewUser({
                      ...newUser,
                      emergencyContact: { ...newUser.emergencyContact, relationship: e.target.value }
                    })}
                    required
                  />
                </FormGroup>
              </FormSection>

              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowAddUser(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Add User
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showEditModal && userToEdit && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Edit User</h3>
              <CloseButton onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </CloseButton>
            </ModalHeader>
            <Form onSubmit={handleEditSubmit}>
              <FormSection>
                <SectionTitle>Personal Information</SectionTitle>
                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={userToEdit.name}
                    onChange={(e) => setUserToEdit({
                      ...userToEdit,
                      name: e.target.value
                    })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={userToEdit.email}
                    onChange={(e) => setUserToEdit({
                      ...userToEdit,
                      email: e.target.value
                    })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={userToEdit.phone}
                    onChange={(e) => setUserToEdit({
                      ...userToEdit,
                      phone: e.target.value
                    })}
                    required
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>License Information</SectionTitle>
                <FormGroup>
                  <Label>License Number</Label>
                  <Input
                    type="text"
                    value={userToEdit.licenseNumber}
                    onChange={(e) => setUserToEdit({
                      ...userToEdit,
                      licenseNumber: e.target.value
                    })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>License Expiry</Label>
                  <Input
                    type="date"
                    value={userToEdit.licenseExpiry}
                    onChange={(e) => setUserToEdit({
                      ...userToEdit,
                      licenseExpiry: e.target.value
                    })}
                    required
                  />
                </FormGroup>
              </FormSection>

              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Save Changes
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showDeleteConfirm && userToDelete && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Confirm Delete</h3>
              <CloseButton onClick={() => setShowDeleteConfirm(false)}>
                <i className="fas fa-times"></i>
              </CloseButton>
            </ModalHeader>
            <DeleteConfirmContent>
              <WarningIcon>
                <i className="fas fa-exclamation-triangle"></i>
              </WarningIcon>
              <DeleteMessage>
                Are you sure you want to delete user <strong>{userToDelete.name}</strong>?
                This action cannot be undone.
              </DeleteMessage>
              <ButtonGroup>
                <CancelButton onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </CancelButton>
                <DeleteButton onClick={handleDeleteConfirm}>
                  Delete User
                </DeleteButton>
              </ButtonGroup>
            </DeleteConfirmContent>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;

  h2 {
    color: #1e3c72;
    margin: 0 0 1rem 0;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #F3F4F6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  width: 300px;

  i {
    color: #6B7280;
    margin-right: 0.5rem;
  }

  input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    font-size: 0.875rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background: white;
  color: #4B5563;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #45a049;
  }
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
`;

const UserCard = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
`;

const UserInfo = styled.div``;

const UserName = styled.h3`
  margin: 0;
  color: #1F2937;
`;

const UserEmail = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ color: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
  text-transform: capitalize;
`;

const UserDetails = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4B5563;
  font-size: 0.875rem;

  i {
    color: #1e3c72;
    width: 16px;
  }
`;

const UserActions = styled.div`
  padding: 1rem;
  display: flex;
  gap: 1rem;
  border-top: 1px solid #E5E7EB;
`;

const ActionSelect = styled.select<{ color: string }>`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${({ color }) => color};
  border-radius: 0.5rem;
  color: ${({ color }) => color};
  background: white;
  cursor: pointer;
`;

const VerificationButton = styled.button<{ status: string }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid ${({ status }) => status === 'verified' ? '#4CAF50' : '#F44336'};
  border-radius: 0.5rem;
  background: white;
  color: ${({ status }) => status === 'verified' ? '#4CAF50' : '#F44336'};
  cursor: pointer;
  text-transform: capitalize;
`;

const ActionButtons = styled.div`
  display: flex;
  padding: 1rem;
  gap: 1rem;
  border-top: 1px solid #E5E7EB;
`;

const ActionButton = styled.button<{ color: string }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${({ color }) => color};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    color: #1e3c72;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E5E7EB;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h4`
  color: #1e3c72;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #1e3c72;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background: #F44336;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const SubmitButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DeleteConfirmContent = styled.div`
  text-align: center;
  padding: 1rem;
`;

const WarningIcon = styled.div`
  font-size: 3rem;
  color: #F44336;
  margin-bottom: 1rem;
`;

const DeleteMessage = styled.p`
  color: #4B5563;
  margin-bottom: 2rem;
  line-height: 1.5;

  strong {
    color: #1F2937;
  }
`;

const DeleteButton = styled.button`
  background: #F44336;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #D32F2F;
  }
`;

export default UserManagement; 