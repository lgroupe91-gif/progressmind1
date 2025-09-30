import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import GoalsTab from './components/GoalsTab';
import NotesTab from './components/NotesTab';
import CycleTab from './components/CycleTab';
import CalendarTab from './components/CalendarTab';
import StatsTab from './components/StatsTab';
import NotificationSettings from './components/NotificationSettings';
import UserProfile from './components/UserProfile';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotifications } from './hooks/useNotifications';
import { Routine, Note, Goal } from './types';
import { 
  initialRoutines, 
} from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [routines, setRoutines] = useLocalStorage<Routine[]>('routines', initialRoutines);
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [globalStreak, setGlobalStreak] = useLocalStorage<number>('globalStreak', 0);
  const [lastCompletionDate, setLastCompletionDate] = useLocalStorage<string>('lastCompletionDate', '');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  const userName = "Alex";
  const currentStreak = globalStreak;

  // Initialize notifications
  useNotifications(routines);

  // Calculate daily progress
  const completedToday = routines.filter(r => r.completed).length;
  const totalRoutines = routines.length;

  // Update global streak when routines are completed
  React.useEffect(() => {
    try {
      const today = new Date().toDateString();
      const hasCompletedRoutines = routines.some(r => r.completed);
      
      if (hasCompletedRoutines && lastCompletionDate !== today) {
        // Check if yesterday was completed to maintain streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (lastCompletionDate === yesterdayString || globalStreak === 0) {
          setGlobalStreak(globalStreak + 1);
        } else {
          setGlobalStreak(1); // Reset streak if gap
        }
        setLastCompletionDate(today);
      }
    } catch (error) {
      console.error('Error updating global streak:', error);
    }
  }, [routines.map(r => r.completed).join(',')]);

  const handleCompleteRoutine = (id: string) => {
    try {
    setRoutines(routines.map(routine => {
      if (routine.id === id) {
        if (routine.completed) {
          // Décocher la routine
          return { 
            ...routine, 
            completed: false, 
            streak: Math.max(0, routine.streak - 1) 
          };
        } else {
          // Cocher la routine
          return { 
            ...routine, 
            completed: true, 
            streak: routine.streak + 1 
          };
        }
      }
      return routine;
    }));
    } catch (error) {
      console.error('Error completing routine:', error);
    }
  };

  const handleUpdateRoutineInput = (id: string, inputValue: string) => {
    setRoutines(routines.map(routine => 
      routine.id === id 
        ? { ...routine, inputValue }
        : routine
    ));
  };

  const handleAddRoutine = (newRoutine: Omit<Routine, 'id'>) => {
    const routine: Routine = {
      ...newRoutine,
      id: Date.now().toString()
    };
    setRoutines([...routines, routine]);
  };

  const handleEditRoutine = (id: string, updates: Partial<Routine>) => {
    setRoutines(routines.map(routine => 
      routine.id === id ? { ...routine, ...updates } : routine
    ));
  };

  const handleDeleteRoutine = (id: string) => {
    setRoutines(routines.filter(routine => routine.id !== id));
  };

  const handleAddNote = (note: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString()
    };
    setNotes([newNote, ...notes]);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'id'>) => {
    const goal: Goal = {
      ...newGoal,
      id: Date.now().toString()
    };
    setGoals([...goals, goal]);
  };

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleCreateRoutineFromGoal = (goalId: string, routine: Omit<Routine, 'id'>) => {
    handleAddRoutine(routine);
    // Link the routine to the goal
    handleUpdateGoal(goalId, {
      relatedRoutines: [...(goals.find(g => g.id === goalId)?.relatedRoutines || []), Date.now().toString()]
    });
  };

  // Handle routine progression
  React.useEffect(() => {
    const checkProgression = () => {
      setRoutines(currentRoutines => 
        currentRoutines.map(routine => {
          if (routine.isProgressive && routine.streak > 0 && routine.streak % 7 === 0) {
            // Every week (7 days), check for progression
            const nextStep = routine.progressionSteps.find(step => step.week > routine.week);
            if (nextStep) {
              return {
                ...routine,
                week: nextStep.week,
                duration: nextStep.duration,
                description: nextStep.description
              };
            }
          }
          return routine;
        })
      );
    };

    checkProgression();
  }, []);

  // Check progression when routines change
  React.useEffect(() => {
    const checkProgression = () => {
      setRoutines(currentRoutines => 
        currentRoutines.map(routine => {
          if (routine.isProgressive && routine.streak > 0 && routine.streak % 7 === 0) {
            const nextStep = routine.progressionSteps.find(step => step.week > routine.week);
            if (nextStep) {
              return {
                ...routine,
                week: nextStep.week,
                duration: nextStep.duration,
                description: nextStep.description
              };
            }
          }
          return routine;
        })
      );
    };

    const timeoutId = setTimeout(checkProgression, 100);
    return () => clearTimeout(timeoutId);
  }, [routines.map(r => r.streak).join(',')]);

  // Reset completed routines daily
  React.useEffect(() => {
    const resetDaily = () => {
      const lastReset = localStorage.getItem('lastReset');
      const today = new Date().toDateString();
      
      if (lastReset !== today) {
        setRoutines(currentRoutines => 
          currentRoutines.map(routine => ({
            ...routine,
            completed: false
          }))
        );
        localStorage.setItem('lastReset', today);
      }
    };

    resetDaily();
    const interval = setInterval(resetDaily, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const renderActiveTab = () => {
    try {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            routines={routines} 
            totalStreak={globalStreak}
            onCompleteRoutine={handleCompleteRoutine}
            onUpdateRoutineInput={handleUpdateRoutineInput}
            onAddRoutine={handleAddRoutine}
            onEditRoutine={handleEditRoutine}
            onDeleteRoutine={handleDeleteRoutine}
          />
        );
      case 'goals':
        return (
          <GoalsTab
            goals={goals}
            routines={routines}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
            onCreateRoutineFromGoal={handleCreateRoutineFromGoal}
          />
        );
      case 'notes':
        return (
          <NotesTab
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        );
      case 'cycle':
        return <CycleTab />;
      case 'calendar':
        return <CalendarTab routines={routines} />;
      case 'stats':
        return (
          <StatsTab 
            routines={routines}
            goals={goals}
          />
        );
      default:
        return (
          <Dashboard 
            routines={routines} 
            totalStreak={globalStreak}
            onCompleteRoutine={handleCompleteRoutine}
            onUpdateRoutineInput={handleUpdateRoutineInput}
            onAddRoutine={handleAddRoutine}
            onEditRoutine={handleEditRoutine}
            onDeleteRoutine={handleDeleteRoutine}
          />
        );
    }
    } catch (error) {
      console.error('Error rendering tab:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header 
        userName={userName} 
        currentStreak={currentStreak}
        onOpenNotifications={() => setShowNotificationSettings(true)}
        onOpenProfile={() => setShowUserProfile(true)}
      />
      
      <main className="py-4 px-3">
        {renderActiveTab()}
      </main>
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {showNotificationSettings && (
        <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
      )}
      
      {showUserProfile && (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      )}
    </div>
  );
}

export default App;