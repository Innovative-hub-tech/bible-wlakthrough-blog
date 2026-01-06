import { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { User } from '../../types'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const usersData = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User))
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (uid: string, role: 'admin' | 'collaborator' | 'reader') => {
    try {
      const permissions = {
        canPublish: role === 'admin' || role === 'collaborator',
        canEditOwnPosts: role === 'admin' || role === 'collaborator',
        canEditAllPosts: role === 'admin',
        canManageUsers: role === 'admin',
      }
      await updateDoc(doc(db, 'users', uid), { role, permissions })
      setUsers(users.map(u => u.uid === uid ? { ...u, role, permissions } : u))
      setEditingUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleDelete = async (uid: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteDoc(doc(db, 'users', uid))
      setUsers(users.filter(u => u.uid !== uid))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" />
                          ) : (
                            <span className="text-purple-600 font-medium">
                              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.displayName || 'No name'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUser?.uid === user.uid ? (
                        <select
                          value={editingUser.role}
                          onChange={(e) => handleUpdateRole(user.uid, e.target.value as 'admin' | 'collaborator' | 'reader')}
                          className="px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="reader">Reader</option>
                          <option value="collaborator">Collaborator</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'collaborator' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(editingUser?.uid === user.uid ? null : user)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Edit Role"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.uid)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
