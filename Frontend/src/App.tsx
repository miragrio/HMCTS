/**
 * Task Management Application Component
 * 
 * Main application component for creating and managing tasks.
 * Features include:
 * - Task creation form with validation
 * - Calendar date picker
 * - Time picker for deadline selection
 * - Modal popup displaying created task details
 * 
 * Follows UK Government Design System styling guidelines.
 */

import { useState, useEffect, useRef, startTransition } from 'react'
import axios from 'axios'
import './App.css'
import logo from './assets/logo.png'

/**
 * Task Creation Interface
 * Defines the structure for creating a new task
 */
interface TaskCreate {
  title: string;
  description?: string;  // Optional description field
  status: string;        // Task status: 'pending', 'in_progress', or 'completed'
  deadline: string;      // ISO datetime string (YYYY-MM-DDTHH:mm:ss)
}

/**
 * Task Response Interface
 * Defines the structure of a task returned from the API
 */
interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: string;
  deadline: string;      // ISO datetime string
  created_at: string;   // ISO datetime string
}

function App() {
  // ============================================
  // State Management
  // ============================================

  /** Form state for task creation */
  const [form, setForm] = useState<TaskCreate>({
    title: '',
    description: '',
    status: 'pending',
    deadline: '',
  });

  /** Separate state for date and time inputs (for better UX) */
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');

  /** Modal visibility and created task data */
  const [showModal, setShowModal] = useState(false);
  const [createdTask, setCreatedTask] = useState<TaskResponse | null>(null);

  /** Calendar and time picker visibility states */
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  /** Calendar state - current month/year being displayed */
  const [calendarDate, setCalendarDate] = useState(new Date());

  /** Time picker state - selected hour and minute */
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);

  /** Refs for click-outside detection */
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const timePickerButtonRef = useRef<HTMLButtonElement>(null);

  // ============================================
  // Effects
  // ============================================

  /**
   * Close calendar and time picker when clicking outside
   * Adds event listener to detect clicks outside the popup components
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showCalendar &&
        calendarRef.current &&
        calendarButtonRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !calendarButtonRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (
        showTimePicker &&
        timePickerRef.current &&
        timePickerButtonRef.current &&
        !timePickerRef.current.contains(event.target as Node) &&
        !timePickerButtonRef.current.contains(event.target as Node)
      ) {
        setShowTimePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar, showTimePicker]);

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * Handle changes to form inputs (title, description, status)
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handle date input changes
   * Updates the date state and combines with time to update deadline
   */
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setDeadlineDate(dateValue);
    updateDeadline(dateValue, deadlineTime);
  };

  /**
   * Handle time input changes
   * Updates the time state and combines with date to update deadline
   */
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setDeadlineTime(timeValue);
    updateDeadline(deadlineDate, timeValue);
  };

  /**
   * Update deadline in form state by combining date and time
   * Formats as ISO datetime string (YYYY-MM-DDTHH:mm:ss)
   * 
   * @param date - Date string in YYYY-MM-DD format
   * @param time - Time string in HH:mm format
   */
  const updateDeadline = (date: string, time: string) => {
    if (date && time) {
      const datetimeString = `${date}T${time}:00`;
      setForm(prev => ({ ...prev, deadline: datetimeString }));
    } else if (date) {
      // If only date is set, use midnight as default time
      const datetimeString = `${date}T00:00:00`;
      setForm(prev => ({ ...prev, deadline: datetimeString }));
    } else {
      setForm(prev => ({ ...prev, deadline: '' }));
    }
  };

  /**
   * Handle date selection from calendar
   * Formats selected date and updates form state
   * 
   * @param day - Selected day of month (1-31)
   * @param month - Selected month (0-11, JavaScript Date format)
   * @param year - Selected year
   */
  const handleDateSelect = (day: number, month: number, year: number) => {
    const selectedDate = new Date(year, month, day);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setDeadlineDate(formattedDate);
    updateDeadline(formattedDate, deadlineTime || '00:00');
    setShowCalendar(false);
  };

  /**
   * Select today's date and current time
   * Quick action button in calendar picker
   */
  const selectToday = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedTime = today.toTimeString().slice(0, 5); // HH:mm format
    setDeadlineDate(formattedDate);
    setDeadlineTime(formattedTime);
    updateDeadline(formattedDate, formattedTime);
    setCalendarDate(today);
    setShowCalendar(false);
  };

  /**
   * Sync calendar and time picker with form deadline
   * Updates calendar month view and time picker selection when deadline changes
   */
  useEffect(() => {
    if (form.deadline) {
      const date = new Date(form.deadline);
      if (!isNaN(date.getTime())) {
        // Batch state updates to avoid cascading renders
        startTransition(() => {
          setCalendarDate(date);
          const dateStr = date.toISOString().split('T')[0];
          const timeStr = date.toTimeString().slice(0, 5);
          setDeadlineDate(dateStr);
          setDeadlineTime(timeStr);
          setSelectedHour(date.getHours());
          setSelectedMinute(date.getMinutes());
        });
      }
    }
  }, [form.deadline]);

  /**
   * Sync time picker selection with deadline time
   * Updates hour and minute selection when time input changes
   */
  useEffect(() => {
    if (deadlineTime) {
      const [hours, minutes] = deadlineTime.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        // Batch state updates to avoid cascading renders
        startTransition(() => {
          setSelectedHour(hours);
          setSelectedMinute(minutes);
        });
      }
    }
  }, [deadlineTime]);

  /**
   * Handle time selection from time picker
   * Formats time and updates form state
   * 
   * @param hour - Selected hour (0-23)
   * @param minute - Selected minute (0-59)
   */
  const handleTimeSelect = (hour: number, minute: number) => {
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setDeadlineTime(formattedTime);
    updateDeadline(deadlineDate, formattedTime);
    setShowTimePicker(false);
  };

  /**
   * Select current time
   * Quick action button in time picker
   */
  const selectCurrentTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    handleTimeSelect(hour, minute);
  };

  // ============================================
  // Calendar Utility Functions
  // ============================================

  /**
   * Get the number of days in a given month
   * 
   * @param date - Date object for the month
   * @returns Number of days in the month
   */
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  /**
   * Get the day of week for the first day of a month
   * Returns 0 (Sunday) through 6 (Saturday)
   * 
   * @param date - Date object for the month
   * @returns Day of week (0-6)
   */
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  /**
   * Navigate to previous or next month in calendar
   * 
   * @param direction - 'prev' to go to previous month, 'next' for next month
   */
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // ============================================
  // Calendar Data Preparation
  // ============================================

  /** Month names for calendar display */
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  /** Day names for calendar weekday headers */
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  /** Calculate calendar grid data */
  const daysInMonth = getDaysInMonth(calendarDate);
  const firstDay = getFirstDayOfMonth(calendarDate);
  const days: (number | null)[] = [];
  
  // Add empty cells for days before the first day of the month (for alignment)
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Add days of the month (1 to daysInMonth)
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // ============================================
  // Form Submission
  // ============================================

  /**
   * Handle form submission
   * Sends task data to backend API and displays success modal
   * 
   * @param e - Form submit event
   */
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<TaskResponse>('http://localhost:8000/', form);
      setCreatedTask(response.data);
      setShowModal(true);
      // Reset form after successful submission
      setForm({
        title: '',
        description: '',
        status: 'pending',
        deadline: '',
      });
      setDeadlineDate('');
      setDeadlineTime('');
    } catch (err) {
      alert('Error creating task: ' + err);
    }
  };

  /**
   * Close the success modal
   * Resets modal state and clears created task data
   */
  const closeModal = () => {
    setShowModal(false);
    setCreatedTask(null);
  };
  
  // ============================================
  // Render
  // ============================================
  
  return (
    <div className="app-container">
      <header className="top-header">
        <img src={logo} alt="Logo" className="header-logo" />
      </header>
      <h1>Task Management System</h1>
      <form onSubmit={submitForm}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" placeholder="Enter task title" value={form.title} onChange={handleChange} required />
        <label htmlFor="description">Description</label>
        <input type="text" id="description" name="description" placeholder="Enter task description (optional)" value={form.description} onChange={handleChange} />
        <label htmlFor="deadline">Deadline</label>
        <div className="deadline-inputs-wrapper">
          <div className="date-input-wrapper">
            <input 
              type="date" 
              id="deadline-date" 
              name="deadline-date" 
              value={deadlineDate} 
              onChange={handleDateChange} 
              required 
            />
            <button 
              ref={calendarButtonRef}
              type="button" 
              className="calendar-button" 
              onClick={() => setShowCalendar(!showCalendar)}
              aria-label="Open calendar"
            >
              📅
            </button>
            {showCalendar && (
              <div ref={calendarRef} className="calendar-popup">
                <div className="calendar-header">
                  <button 
                    type="button" 
                    className="calendar-nav-button" 
                    onClick={() => navigateMonth('prev')}
                    aria-label="Previous month"
                  >
                    ‹
                  </button>
                  <h3 className="calendar-month-year">
                    {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                  </h3>
                  <button 
                    type="button" 
                    className="calendar-nav-button" 
                    onClick={() => navigateMonth('next')}
                    aria-label="Next month"
                  >
                    ›
                  </button>
                </div>
                <div className="calendar-weekdays">
                  {dayNames.map(day => (
                    <div key={day} className="calendar-weekday">{day}</div>
                  ))}
                </div>
                <div className="calendar-days">
                  {days.map((day, index) => {
                    const today = new Date();
                    const isToday = day === today.getDate() && 
                                    calendarDate.getMonth() === today.getMonth() &&
                                    calendarDate.getFullYear() === today.getFullYear();
                    const isSelected = day && deadlineDate && 
                                      new Date(deadlineDate).getDate() === day &&
                                      new Date(deadlineDate).getMonth() === calendarDate.getMonth() &&
                                      new Date(deadlineDate).getFullYear() === calendarDate.getFullYear();
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        className={`calendar-day ${day === null ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                        onClick={() => day && handleDateSelect(day, calendarDate.getMonth(), calendarDate.getFullYear())}
                        disabled={day === null}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <div className="calendar-footer">
                  <button type="button" className="calendar-today-button" onClick={selectToday}>
                    Today
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="time-input-wrapper">
            <input 
              type="time" 
              id="deadline-time" 
              name="deadline-time" 
              value={deadlineTime} 
              onChange={handleTimeChange}
              required
            />
            <button 
              ref={timePickerButtonRef}
              type="button" 
              className="time-picker-button" 
              onClick={() => setShowTimePicker(!showTimePicker)}
              aria-label="Open time picker"
            >
              🕐
            </button>
            {showTimePicker && (
              <div ref={timePickerRef} className="time-picker-popup">
                <div className="time-picker-header">
                  <h3 className="time-picker-title">Select Time</h3>
                </div>
                <div className="time-picker-body">
                  <div className="time-picker-column">
                    <div className="time-picker-label">Hour</div>
                    <div className="time-picker-scroll">
                      {Array.from({ length: 24 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`time-picker-option ${selectedHour === i ? 'selected' : ''}`}
                          onClick={() => setSelectedHour(i)}
                        >
                          {i.toString().padStart(2, '0')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="time-picker-separator">:</div>
                  <div className="time-picker-column">
                    <div className="time-picker-label">Minute</div>
                    <div className="time-picker-scroll">
                      {Array.from({ length: 60 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`time-picker-option ${selectedMinute === i ? 'selected' : ''}`}
                          onClick={() => setSelectedMinute(i)}
                        >
                          {i.toString().padStart(2, '0')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="time-picker-footer">
                  <button type="button" className="time-picker-today-button" onClick={selectCurrentTime}>
                    Now
                  </button>
                  <button 
                    type="button" 
                    className="time-picker-confirm-button" 
                    onClick={() => handleTimeSelect(selectedHour, selectedMinute)}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">Create Task</button>
      </form>

      {/* Success Modal - Displays created task details */}
      {showModal && createdTask && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Task Created Successfully!</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="task-detail">
                <label>Title:</label>
                <p>{createdTask.title}</p>
              </div>
              {createdTask.description && (
                <div className="task-detail">
                  <label>Description:</label>
                  <p>{createdTask.description}</p>
                </div>
              )}
              <div className="task-detail">
                <label>Status:</label>
                <p className={`status-badge status-${createdTask.status}`}>{createdTask.status}</p>
              </div>
              <div className="task-detail">
                <label>Deadline:</label>
                <p>{new Date(createdTask.deadline).toLocaleString()}</p>
              </div>
              <div className="task-detail">
                <label>Created:</label>
                <p>{new Date(createdTask.created_at).toLocaleString()}</p>
              </div>
              <div className="task-detail">
                <label>ID:</label>
                <p className="task-id">{createdTask.id}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
