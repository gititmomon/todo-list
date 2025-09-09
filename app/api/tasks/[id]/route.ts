import { type NextRequest, NextResponse } from "next/server"

// Mock data store - replace with actual database/ATDAPI integration
const tasks = [
  { id: 1, description: "Complete the todo list assignment", completed: false },
  { id: 2, description: "Test all functionality", completed: false },
  { id: 3, description: "Submit the project", completed: false },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const taskIndex = tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...body }
    return NextResponse.json(tasks[taskIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const taskIndex = tasks.findIndex((task) => task.id === id)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks.splice(taskIndex, 1)
    return NextResponse.json({ message: "Task deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
