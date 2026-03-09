import { NextRequest, NextResponse } from "next/server"

// In-memory store for demo purposes
// In production, replace with database calls
let users = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@yesua.edu",
    role: "Professor",
    status: "active",
    department: "Computer Science",
    createdAt: "2024-01-15",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    email: "michael.chen@yesua.edu",
    role: "Department Head",
    status: "active",
    department: "Engineering",
    createdAt: "2024-02-20",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@yesua.edu",
    role: "Student",
    status: "active",
    department: "Business Administration",
    createdAt: "2024-03-10",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@yesua.edu",
    role: "Admin",
    status: "active",
    department: "IT Services",
    createdAt: "2024-01-05",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@yesua.edu",
    role: "Professor",
    status: "inactive",
    department: "Mathematics",
    createdAt: "2024-02-28",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
]

// GET /api/users - Get all users or get user by ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (id) {
      const user = users.find((u) => u.id === id)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      return NextResponse.json(user)
    }

    // Filter options
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let filteredUsers = [...users]

    if (role) {
      filteredUsers = filteredUsers.filter((u) =>
        u.role.toLowerCase().includes(role.toLowerCase())
      )
    }

    if (status) {
      filteredUsers = filteredUsers.filter((u) => u.status === status)
    }

    if (search) {
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json(filteredUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, status, department, avatar } = body

    // Validation
    if (!name || !email || !role || !department) {
      return NextResponse.json(
        { error: "Name, email, role, and department are required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    const newUser = {
      id: String(Date.now()),
      name,
      email,
      role,
      status: status || "active",
      department,
      avatar: avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    }

    users.push(newUser)

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

// PUT /api/users - Update a user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email, role, status, department, avatar } = body

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if email is being changed to an existing email
    if (email && email !== users[userIndex].email && users.some((u) => u.email === email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    const updatedUser = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      role: role || users[userIndex].role,
      status: status !== undefined ? status : users[userIndex].status,
      department: department || users[userIndex].department,
      avatar: avatar || users[userIndex].avatar,
    }

    users[userIndex] = updatedUser

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// DELETE /api/users - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    users.splice(userIndex, 1)

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
