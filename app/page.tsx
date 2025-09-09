"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: number
  description: string
  completed: boolean
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [loading, setLoading] = useState(true)

  // Mock ATDAPI server calls - replace with actual API endpoints
  const fetchTasks = async () => {
    try {
      setLoading(true)
      // Simulating API call - replace with actual ATDAPI endpoint
      const response = await fetch("/api/tasks")
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      } else {
        // Fallback to mock data if API not available
        setTasks([
          { id: 1, description: "Complete the todo list assignment", completed: false },
          { id: 2, description: "Test all functionality", completed: false },
          { id: 3, description: "Submit the project", completed: false },
        ])
      }
    } catch (error) {
      // Fallback to mock data if API not available
      setTasks([
        { id: 1, description: "Complete the todo list assignment", completed: false },
        { id: 2, description: "Test all functionality", completed: false },
        { id: 3, description: "Submit the project", completed: false },
      ])
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTask.trim()) return

    const task: Task = {
      id: Date.now(), // Simple ID generation
      description: newTask.trim(),
      completed: false,
    }

    try {
      // Simulating API call - replace with actual ATDAPI endpoint
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })

      if (response.ok) {
        const createdTask = await response.json()
        setTasks((prev) => [...prev, createdTask])
      } else {
        // Fallback to local state update
        setTasks((prev) => [...prev, task])
      }
    } catch (error) {
      // Fallback to local state update
      setTasks((prev) => [...prev, task])
    }

    setNewTask("")
  }

  const removeTask = async (id: number) => {
    try {
      // Simulating API call - replace with actual ATDAPI endpoint
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (response.ok || response.status === 404) {
        setTasks((prev) => prev.filter((task) => task.id !== id))
      }
    } catch (error) {
      // Fallback to local state update
      setTasks((prev) => prev.filter((task) => task.id !== id))
    }
  }

  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const updatedTask = { ...task, completed: !task.completed }

    try {
      // Simulating API call - replace with actual ATDAPI endpoint
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      })

      if (response.ok) {
        const updated = await response.json()
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      } else {
        // Fallback to local state update
        setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)))
      }
    } catch (error) {
      // Fallback to local state update
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)))
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">To Do List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add new task section */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={addTask} disabled={!newTask.trim()}>
                Add Task
              </Button>
            </div>

            {/* Tasks list */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No tasks yet. Add one above to get started!
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg transition-colors",
                      task.completed ? "bg-muted/50 border-muted" : "bg-card border-border hover:bg-accent/50",
                    )}
                  >
                    {/* Task description */}
                    <div
                      className={cn(
                        "flex-1 text-sm",
                        task.completed ? "line-through text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {task.description}
                    </div>

                    {/* Toggle complete/active button */}
                    <Button
                      variant={task.completed ? "secondary" : "default"}
                      size="sm"
                      onClick={() => toggleTask(task.id)}
                      className="h-8 w-8 p-0"
                    >
                      {task.completed ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>

                    {/* Remove button */}
                    <Button variant="destructive" size="sm" onClick={() => removeTask(task.id)} className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Task summary */}
            {tasks.length > 0 && (
              <div className="text-sm text-muted-foreground text-center pt-4 border-t">
                {tasks.filter((t) => !t.completed).length} of {tasks.length} tasks remaining
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
