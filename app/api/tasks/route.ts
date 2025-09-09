import { type NextRequest, NextResponse } from "next/server"

// Mock data store - replace with actual database/ATDAPI integration
const tasks = [
  { id: 1, description: "Complete the todo list assignment", completed: false },
  { id: 2, description: "Test all functionality", completed: false },
  { id: 3, description: "Submit the project", completed: false },
]

export async function GET() {
  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newTask = {
      id: body.id || Date.now(),
      description: body.description,
      completed: body.completed || false,
    }

    tasks.push(newTask)
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
