import { computed, Injectable, signal } from '@angular/core';
import { Task } from '../models/types/task.type';
import { TaskFilter } from '../models/types/filter.type';
import { TaskStatus } from '../models/enum/task-status.enum';

@Injectable({
  providedIn: 'root',
})
export class TaskServices {
  
  private tasksignal = signal<Task[]>([]);
  filterSignal = signal<TaskFilter>('ALL');

  tasks = computed(() => this.tasksignal());

  filteredTasks = computed(() => {
    const filter = this.filterSignal();
    const tasks = this.tasksignal();

    if (filter === 'ALL') return tasks;

    return tasks.filter((task) => task.status === filter);
  });

  addTask(title: string, description: string) {
    const newTask: Task = {
      createdAt: new Date(),
      description,
      id: crypto.randomUUID(),
      status: TaskStatus.TODO,
      title,
    };

    this.tasksignal.update((tasks) => [...tasks, newTask]);
  }

  removeTask(id: string) {
    this.tasksignal.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  changeStatus(id: string, status: TaskStatus) {
    this.tasksignal.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, status } : task)),
    );
  }
}
