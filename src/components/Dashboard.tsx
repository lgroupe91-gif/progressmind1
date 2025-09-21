import React from 'react';
import { CheckCircle, Quote, Trophy, Flame, Check, Edit3, Target, Plus, Play, Volume2, TrendingUp, Trash2 } from 'lucide-react';
import { Routine, RoutineTemplate } from '../types';
import { extendedRoutineTemplates, meditationGuides } from '../data/mockData';

interface DashboardProps {
  routines: Routine[];
  onCompleteRoutine: (id: string) => void;
  onUpdateRoutineInput: (id: string, inputValue: string) => void;
  onAddRoutine: (routine: Omit<Routine, 'id'>) => void;
  onEditRoutine: (id: string, updates: Partial<Routine>) => void;
  onDeleteRoutine: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  routines, 
  onCompleteRoutine, 
  onUpdateRoutineInput,
  onAddRoutine,
  onEditRoutine,
  onDeleteRoutine
}) => {
  const [editingRoutine, setEditingRoutine] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [showTemplates, setShowTemplates] = React.useState(false);
  const [showCustomForm, setShowCustomForm] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [customRoutine, setCustomRoutine] = React.useState({
    title: '',
    description: '',
    category: 'morning' as const,
    duration: 10,
    color: 'bg-purple-500',
    icon: '⭐',
    scheduledTime: '',
    notificationsEnabled: false
  });
  const [meditationTimer, setMeditationTimer] = React.useState<{
    routineId: string | null;
    timeLeft: number;
    isRunning: boolean;
    totalTime: number;
    startTime: number;
  }>({
    routineId: null,
    timeLeft: 0,
    isRunning: false,
    totalTime: 0,
    startTime: 0
  });

  const morningRoutines = routines.filter(r => r.category === 'morning');
  const afternoonRoutines = routines.filter(r => r.category === 'afternoon');
  const eveningRoutines = routines.filter(r => r.category === 'evening');
  
  const completedToday = routines.filter(r => r.completed).length;
  const totalStreak = routines.reduce((sum, r) => sum + r.streak, 0);

  // Citations du jour - une différente chaque jour
  const dailyQuotes = [
    "Le succès, c'est tomber sept fois et se relever huit fois. - Proverbe japonais",
    "La seule façon d'accomplir un excellent travail est d'aimer ce que vous faites. - Steve Jobs",
    "Votre limitation, c'est seulement votre imagination.",
    "Les grandes choses ne viennent jamais de zones de confort.",
    "Rêvez-le. Souhaitez-le. Faites-le.",
    "Le succès ne vient pas à vous, vous devez aller vers lui.",
    "Ne vous arrêtez pas quand vous êtes fatigué. Arrêtez-vous quand vous avez terminé.",
    "Réveillez-vous avec détermination. Couchez-vous avec satisfaction.",
    "Faites quelque chose aujourd'hui dont votre futur vous remerciera.",
    "Peu importe la lenteur de votre progression, vous dépassez tous ceux qui n'essaient pas.",
    "Votre seule limite est votre mental.",
    "Poussez-vous, parce que personne d'autre ne le fera pour vous.",
    "Parfois plus tard devient jamais. Faites-le maintenant.",
    "Les champions continuent à jouer jusqu'à ce qu'ils réussissent. - Billie Jean King",
    "Croyez en vous et tout devient possible.",
    "Transformez vos blessures en sagesse. - Oprah Winfrey",
    "La discipline est le pont entre les objectifs et l'accomplissement. - Jim Rohn",
    "Vous êtes plus courageux que vous ne le croyez, plus fort que vous ne le paraissez.",
    "Chaque expert était autrefois un débutant. Chaque pro était autrefois un amateur.",
    "La différence entre l'ordinaire et l'extraordinaire, c'est ce petit 'extra'.",
    "Ne regardez pas l'horloge ; faites comme elle. Continuez d'avancer. - Sam Levenson",
    "Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment est maintenant.",
    "Vous n'avez pas à être parfait, vous devez juste être cohérent.",
    "Les petites actions quotidiennes créent des résultats extraordinaires.",
    "Votre vie ne s'améliore pas par hasard, elle s'améliore par changement.",
    "Soyez vous-même ; tout le monde est déjà pris. - Oscar Wilde",
    "L'avenir appartient à ceux qui croient en la beauté de leurs rêves. - Eleanor Roosevelt",
    "Ce que vous faites aujourd'hui peut améliorer tous vos lendemains. - Ralph Marston",
    "La motivation vous fait commencer. L'habitude vous fait continuer. - Jim Ryun",
    "Investissez en vous-même. Votre carrière est le moteur de votre richesse. - Paul Clitheroe",
    "Chaque jour est une nouvelle opportunité de changer votre vie."
  ];

  // Obtenir la citation du jour basée sur la date
  const getTodayQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return dailyQuotes[dayOfYear % dailyQuotes.length];
  };
  const categories = {
    morning: { label: 'Matin', icon: '🌅', color: 'from-orange-400 to-orange-600' },
    afternoon: { label: 'Après-midi', icon: '☀️', color: 'from-yellow-400 to-yellow-600' },
    evening: { label: 'Soir', icon: '🌙', color: 'from-indigo-400 to-indigo-600' }
  };

  // Meditation timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (meditationTimer.isRunning && meditationTimer.timeLeft > 0) {
      interval = setInterval(() => {
        setMeditationTimer(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (meditationTimer.timeLeft === 0 && meditationTimer.isRunning) {
      // Timer finished - complete the routine
      if (meditationTimer.routineId) {
        onCompleteRoutine(meditationTimer.routineId);
        setMeditationTimer({
          routineId: null,
          timeLeft: 0,
          isRunning: false,
          totalTime: 0,
          startTime: 0
        });
      }
    }
    return () => clearInterval(interval);
  }, [meditationTimer.isRunning, meditationTimer.timeLeft, meditationTimer.routineId, onCompleteRoutine]);

  const handleInputSave = (routineId: string) => {
    onUpdateRoutineInput(routineId, inputValue);
    onCompleteRoutine(routineId);
    setEditingRoutine(null);
    setInputValue('');
  };

  const startEditing = (routine: Routine) => {
    setEditingRoutine(routine.id);
    setInputValue(routine.inputValue || '');
  };

  const startMeditation = (routine: Routine) => {
    const timeInSeconds = routine.duration * 60;
    const now = Date.now();
    setMeditationTimer({
      routineId: routine.id,
      timeLeft: timeInSeconds,
      isRunning: true,
      totalTime: timeInSeconds,
      startTime: now
    });
  };

  const stopMeditation = () => {
    setMeditationTimer({
      routineId: null,
      timeLeft: 0,
      isRunning: false,
      totalTime: 0,
      startTime: 0
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAffirmationExamples = () => [
    "Je suis capable d'atteindre tous mes objectifs",
    "Chaque jour, je deviens une meilleure version de moi-même",
    "J'attire l'abondance et le succès dans ma vie",
    "Je mérite le bonheur et la réussite",
    "Ma confiance en moi grandit chaque jour",
    "Je suis reconnaissant(e) pour toutes les opportunités qui s'offrent à moi"
  ];

  const getGratitudeExamples = () => [
    'Ma santé qui me permet de vivre pleinement',
    'Un moment de rire partagé avec un proche',
    'Le confort de mon foyer',
    'Une compétence que j\'ai développée',
    'Un acte de gentillesse reçu ou donné',
    'La beauté de la nature qui m\'entoure',
    'Une opportunité qui s\'est présentée',
    'Mon lit douillet après une longue journée',
    'Un repas délicieux que j\'ai savouré',
    'La technologie qui facilite ma vie',
    'Un livre ou film qui m\'a inspiré(e)',
    'La liberté de faire mes propres choix'
  ];

  const getManifestationExamples = () => [
    'Je me vois déjà dans mon nouveau poste, confiant(e) et épanoui(e)',
    'Je ressens la joie d\'avoir atteint mon objectif de santé',
    'Je visualise ma relation harmonieuse et aimante',
    'Je me vois célébrant ma réussite financière',
    'J\'imagine ma vie équilibrée et sereine',
    'Je ressens la fierté d\'avoir accompli mon rêve'
  ];

  const handleAddTemplate = (template: RoutineTemplate) => {
    const currentStep = template.progressionSteps[0];
    onAddRoutine({
      title: template.title,
      description: currentStep.description,
      category: selectedCategory, // Utilise la catégorie sélectionnée au lieu de celle du template
      duration: currentStep.duration,
      completed: false,
      streak: 0,
      week: 1,
      maxWeeks: template.progressionSteps.length,
      color: template.color,
      icon: template.icon,
      isProgressive: template.isProgressive,
      progressionSteps: template.progressionSteps
    });
    setShowTemplates(false);
  };

  const handleAddCustomRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoutine({
      ...customRoutine,
      completed: false,
      streak: 0,
      week: 1,
      maxWeeks: 1,
      isProgressive: false,
      progressionSteps: [
        { week: 1, duration: customRoutine.duration, description: customRoutine.description }
      ],
      scheduledTime: customRoutine.scheduledTime,
      notificationsEnabled: customRoutine.notificationsEnabled
    });
    setCustomRoutine({
      title: '',
      description: '',
      category: 'morning',
      duration: 10,
      color: 'bg-purple-500',
      icon: '⭐',
      scheduledTime: '',
      notificationsEnabled: false
    });
    setShowCustomForm(false);
  };

  const handleToggleRoutine = (routineId: string) => {
    onCompleteRoutine(routineId);
  };

  const renderRoutineItem = (routine: Routine) => {
    const needsInput = routine.title.includes('Gratitude') || 
                      routine.title.includes('Planification') || 
                      routine.title.includes('Affirmations') ||
                      routine.title.includes('Manifestation') ||
                      routine.title.includes('Visualisation');
    
    const isEditing = editingRoutine === routine.id;
    const isMeditation = routine.title.toLowerCase().includes('méditation');
    const isMeditationRunning = meditationTimer.routineId === routine.id && meditationTimer.isRunning;
    
    const getFrequencyLabel = (frequency?: string) => {
      switch (frequency) {
        case 'weekly': return '📆 Hebdo';
        case 'monthly': return '🗓️ Mensuel';
        default: return '📅 Quotidien';
      }
    };
    
    return (
      <div key={routine.id} className={`p-4 rounded-lg shadow-sm border ${
        routine.isGoalLinked 
          ? 'bg-purple-100 border-purple-300' 
          : isMeditationRunning
          ? 'bg-green-100 border-green-300'
          : 'bg-white border-gray-200 shadow-md'
      }`}>
        <div className="flex items-center space-x-4">
          {!isMeditation || routine.completed ? (
            <button
              onClick={() => handleToggleRoutine(routine.id)}
              disabled={needsInput && !routine.inputValue && !isEditing && !routine.completed}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                routine.completed
                  ? routine.isGoalLinked 
                    ? 'bg-purple-600 border-purple-600 text-white hover:bg-purple-500 cursor-pointer shadow-md'
                    : 'bg-green-600 border-green-600 text-white hover:bg-green-500 cursor-pointer shadow-md'
                  : needsInput && !routine.inputValue
                  ? 'border-gray-300 bg-gray-200 cursor-not-allowed'
                  : routine.isGoalLinked
                  ? 'border-purple-400 hover:border-purple-600 cursor-pointer hover:bg-purple-50'
                  : 'border-gray-400 hover:border-gray-600 cursor-pointer hover:bg-gray-50'
              }`}
              title={routine.completed ? 'Cliquer pour décocher' : 'Cliquer pour cocher'}
            >
              {routine.completed && <Check className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 bg-gray-200"></div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{routine.icon}</span>
              <h3 className={`font-medium ${routine.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {routine.title}
              </h3>
              {routine.isGoalLinked && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center space-x-1 font-medium">
                  <Target className="w-3 h-3" />
                  <span>Objectif</span>
                </span>
              )}
              <span className="text-sm text-gray-500">({routine.duration} min)</span>
              {routine.frequency && routine.frequency !== 'daily' && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  {getFrequencyLabel(routine.frequency)}
                </span>
              )}
              {routine.isProgressive && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                  Semaine {routine.week}
                </span>
              )}
              {needsInput && !isEditing && !routine.completed && (
                <button
                  onClick={() => startEditing(routine)}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{routine.description}</p>
            
            {/* Meditation Timer */}
            {isMeditation && !routine.completed && (
              <div className="mt-3">
                {isMeditationRunning ? (
                  <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-green-800 font-medium">🧘 Méditation en cours...</span>
                      <button
                        onClick={stopMeditation}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Arrêter
                      </button>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-700 mb-2">
                        {formatTime(meditationTimer.timeLeft)}
                      </div>
                      <div className="bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${meditationTimer.totalTime > 0 ? ((meditationTimer.totalTime - meditationTimer.timeLeft) / meditationTimer.totalTime) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-sm text-green-600 mt-2">
                        {Math.round(((meditationTimer.totalTime - meditationTimer.timeLeft) / meditationTimer.totalTime) * 100)}% terminé
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => startMeditation(routine)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                      <span>🧘</span>
                      <span>Méditation guidée ({routine.duration} min)</span>
                    </button>
                    <button
                      onClick={() => handleToggleRoutine(routine.id)}
                     className="w-full bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                      <span>🤲</span>
                      <span>Méditation libre (marquer comme fait)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Message d'encouragement pour les routines d'objectifs */}
            {routine.completed && routine.isGoalLinked && (
              <div className="mt-2 p-3 bg-purple-100 border border-purple-300 rounded-lg shadow-sm">
                <p className="text-sm text-purple-700 font-medium flex items-center space-x-2">
                  <span>🎉</span>
                  <span>{routine.encouragementMessage || 'Bravo ! Tu te rapproches de ton objectif !'}</span>
                </p>
              </div>
            )}
            
            {/* Input field for routines that need it */}
            {needsInput && (
              <div className="mt-3">
                {isEditing ? (
                  <>
                    {routine.title.includes('Affirmations') && (
                      <div className="text-xs text-blue-600 mb-2">
                        <p className="font-medium">Exemples d'affirmations :</p>
                        <div className="grid grid-cols-1 gap-1 mt-1">
                          {getAffirmationExamples().slice(0, 3).map((example, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInputValue(example)}
                              className="text-left text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                            >
                              "• {example}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {routine.title.includes('Gratitude') && (
                      <div className="text-xs text-pink-600 mb-2">
                        <p className="font-medium">Exemples de gratitude :</p>
                        <div className="grid grid-cols-1 gap-1 mt-1">
                          {getGratitudeExamples().slice(0, 3).map((example, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInputValue(example)}
                              className="text-left text-xs text-pink-500 hover:text-pink-700 hover:bg-pink-50 p-1 rounded"
                            >
                              "• {example}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {(routine.title.includes('Manifestation') || routine.title.includes('Visualisation')) && (
                      <div className="text-xs text-purple-600 mb-2">
                        <p className="font-medium">Exemples de visualisation :</p>
                        <div className="grid grid-cols-1 gap-1 mt-1">
                          {getManifestationExamples().slice(0, 3).map((example, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInputValue(example)}
                              className="text-left text-xs text-purple-500 hover:text-purple-700 hover:bg-purple-50 p-1 rounded"
                            >
                              "• {example}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        routine.title.includes('Gratitude') ? 'Pour quoi es-tu reconnaissant(e) aujourd\'hui ?' :
                        routine.title.includes('Planification') ? 'Quelles sont tes priorités pour demain ?' :
                        routine.title.includes('Affirmations') ? 'Écris tes affirmations positives...' :
                        routine.title.includes('Manifestation') || routine.title.includes('Visualisation') ? 'Décris ta visualisation avec émotion et détails...' :
                        'Écris tes pensées...'
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleInputSave(routine.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => {
                          setEditingRoutine(null);
                          setInputValue('');
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                    </div>
                  </>
                ) : routine.inputValue ? (
                  <div className={`p-3 rounded-lg text-sm text-gray-700 border-l-4 shadow-sm ${
                    routine.title.includes('Gratitude') ? 'bg-pink-100 border-pink-400' :
                    routine.title.includes('Manifestation') || routine.title.includes('Visualisation') ? 'bg-purple-100 border-purple-400' :
                    routine.title.includes('Affirmations') ? 'bg-blue-100 border-blue-400' :
                    'bg-teal-100 border-teal-400'
                  }`}>
                    {routine.inputValue}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Clique sur ✏️ pour {routine.title.includes('Gratitude') ? 'exprimer ta gratitude' : 
                    routine.title.includes('Planification') ? 'planifier demain' : 
                    routine.title.includes('Affirmations') ? 'écrire tes affirmations' :
                    routine.title.includes('Manifestation') || routine.title.includes('Visualisation') ? 'visualiser tes objectifs' :
                    'compléter cette routine'}
                  </div>
                )}
              </div>
            )}
          </div>
          {routine.streak > 0 && (
            <div className="flex items-center space-x-1 text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-bold">{routine.streak}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-xl shadow-md sm:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs">Citation du jour</p>
              <p className="text-sm font-medium leading-relaxed">{getTodayQuote()}</p>
            </div>
            <Quote className="w-8 h-8 text-white/60 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-400 to-accent-600 text-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs">Terminées</p>
              <p className="text-2xl font-bold">{completedToday}/{routines.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-white/60" />
          </div>
        </div>
      </div>

      {/* Add Routine Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter une routine</span>
        </button>
      </div>

      {/* Template Selection */}
      {showTemplates && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 mb-6">
          <h3 className="text-lg font-semibold mb-4">Choisir une routine</h3>
          
          {/* Category Tabs */}
          <div className="flex space-x-1 mb-4 overflow-x-auto">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {extendedRoutineTemplates
              .map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 ${template.color} rounded-full flex items-center justify-center text-white`}>
                      {template.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{template.title}</h4>
                      <p className="text-sm text-gray-600">
                        {template.isProgressive ? 'Progressive' : template.progressionSteps[0].duration + ' min'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  {template.isProgressive && (
                    <div className="text-sm text-blue-600 mb-3">
                      Commence par {template.progressionSteps[0].duration} min, évolue jusqu'à {template.progressionSteps[template.progressionSteps.length - 1].duration} min
                    </div>
                  )}
                  <button
                    onClick={() => handleAddTemplate(template)}
                    className={`w-full text-white py-2 rounded-lg text-sm transition-colors bg-gradient-to-r ${categories[selectedCategory].color}`}
                  >
                    Ajouter au {categories[selectedCategory].label.toLowerCase()}
                  </button>
                </div>
              ))}
          </div>

          {/* Custom Routine Option */}
          <div className="border-t pt-4">
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              + Créer une routine personnalisée
            </button>
          </div>

          {/* Custom Form */}
          {showCustomForm && (
            <form onSubmit={handleAddCustomRoutine} className="mt-4 space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom de la routine"
                  value={customRoutine.title}
                  onChange={(e) => setCustomRoutine({...customRoutine, title: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <select
                  value={customRoutine.category}
                  onChange={(e) => setCustomRoutine({...customRoutine, category: e.target.value as any})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Object.entries(categories).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Description de la routine"
                value={customRoutine.description}
                onChange={(e) => setCustomRoutine({...customRoutine, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Durée (minutes)"
                  value={customRoutine.duration}
                  onChange={(e) => setCustomRoutine({...customRoutine, duration: parseInt(e.target.value)})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="5"
                  max="120"
                  required
                />
                <input
                  type="time"
                  placeholder="Heure de rappel"
                  value={customRoutine.scheduledTime}
                  onChange={(e) => setCustomRoutine({...customRoutine, scheduledTime: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Icône (emoji)"
                  value={customRoutine.icon}
                  onChange={(e) => setCustomRoutine({...customRoutine, icon: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={customRoutine.notificationsEnabled}
                    onChange={(e) => setCustomRoutine({...customRoutine, notificationsEnabled: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="notifications" className="text-sm text-gray-700">
                    Notifications
                  </label>
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowTemplates(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Routines by Time of Day */}
      <div className="space-y-6">
        {/* Morning Routines */}
        {morningRoutines.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-orange-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-orange-100 p-1.5 rounded-full">
                <span className="text-lg">🌅</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Routines du Matin</h2>
            </div>
            <div className="space-y-2">
              {morningRoutines.map(renderRoutineItem)}
            </div>
          </div>
        )}

        {/* Afternoon Routines */}
        {afternoonRoutines.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-yellow-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-yellow-100 p-1.5 rounded-full">
                <span className="text-lg">☀️</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Routines de l'Après-midi</h2>
            </div>
            <div className="space-y-2">
              {afternoonRoutines.map(renderRoutineItem)}
            </div>
          </div>
        )}

        {/* Evening Routines */}
        {eveningRoutines.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-indigo-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-indigo-100 p-1.5 rounded-full">
                <span className="text-lg">🌙</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Routines du Soir</h2>
            </div>
            <div className="space-y-2">
              {eveningRoutines.map(renderRoutineItem)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;