import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Calendar, Lightbulb, Quote, Settings, Save } from 'lucide-react';
import { CycleData, CyclePhase, PhaseInfo } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CycleTab: React.FC = () => {
  const [cycleData, setCycleData] = useLocalStorage<CycleData>('cycleData', {
    lastPeriodDate: '',
    cycleLength: 28
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [tempData, setTempData] = useState(cycleData);

  const getPhaseAdjustments = (phase: CyclePhase): string[] => {
    switch (phase) {
      case 'menstruation':
        return [
          'Réduis l\'intensité des exercices physiques',
          'Privilégie les étirements doux et le yoga',
          'Ajoute des exercices de respiration profonde',
          'Augmente les temps de repos et de méditation',
          'Évite les nouvelles habitudes difficiles',
          'Focus sur l\'auto-compassion et la douceur'
        ];
      case 'folliculaire':
        return [
          'Parfait moment pour lancer de nouvelles routines',
          'Augmente progressivement l\'intensité des exercices',
          'Planifie tes objectifs les plus ambitieux',
          'Profite de l\'énergie montante pour les défis',
          'Ajoute des activités créatives et stimulantes',
          'C\'est le moment d\'essayer de nouvelles choses'
        ];
      case 'ovulation':
        return [
          'Maximise les activités sociales et de networking',
          'Planifie les tâches les plus difficiles ou importantes',
          'Profite de ta confiance pour les présentations',
          'Intensité maximale pour les exercices physiques',
          'Focus sur la communication et l\'expression',
          'Moment idéal pour les négociations importantes'
        ];
      case 'lutéale':
        return [
          'Privilégie l\'organisation et la consolidation',
          'Réduis progressivement l\'intensité des activités',
          'Focus sur les tâches de routine et d\'entretien',
          'Ajoute plus de temps pour la relaxation',
          'Simplifie ton planning et évite la surcharge',
          'Prépare-toi mentalement pour la phase suivante'
        ];
      default:
        return [];
    }
  };

  const getPhaseInfo = (phase: CyclePhase) => {
    switch (phase) {
      case 'menstruation':
        return {
          mood: 'Fatigue, sensibilité',
          message: 'Il est normal de ressentir une baisse d\'énergie.',
          businessOrientation: 'Favorise l\'introspection et les tâches simples.',
          cardColor: 'from-red-100 to-red-200 dark:from-red-900 dark:to-red-800',
          borderColor: 'border-red-300 dark:border-red-600'
        };
      case 'folliculaire':
        return {
          mood: 'Énergie montante, motivation',
          message: 'Ton énergie revient, idéale pour démarrer de nouveaux projets.',
          businessOrientation: 'Planifie, crée, lance des routines ambitieuses.',
          cardColor: 'from-green-100 to-green-200 dark:from-green-900 dark:to-green-800',
          borderColor: 'border-green-300 dark:border-green-600'
        };
      case 'ovulation':
        return {
          mood: 'Confiance, sociabilité',
          message: 'Ton énergie et ta confiance sont au maximum.',
          businessOrientation: 'Parfait pour rendez-vous importants, networking, décisions stratégiques.',
          cardColor: 'from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800',
          borderColor: 'border-orange-300 dark:border-orange-600'
        };
      case 'lutéale':
        return {
          mood: 'Irritabilité, besoin de structure',
          message: 'Les fluctuations d\'humeur sont normales, sois indulgente avec toi-même.',
          businessOrientation: 'Concentre-toi sur l\'organisation, le suivi et la clôture des dossiers.',
          cardColor: 'from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800',
          borderColor: 'border-purple-300 dark:border-purple-600'
        };
      default:
        return {
          mood: '',
          message: '',
          businessOrientation: '',
          cardColor: 'from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800',
          borderColor: 'border-gray-300 dark:border-gray-600'
        };
    }
  };
  const calculatePhaseInfo = (lastPeriodDate: string, cycleLength: number): PhaseInfo | null => {
    if (!lastPeriodDate) return null;

    const lastPeriod = new Date(lastPeriodDate);
    const today = new Date();
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const dayOfCycle = (daysSinceLastPeriod % cycleLength) + 1;

    let phase: CyclePhase;
    let advice: string;
    let quote: string;

    if (dayOfCycle <= 5) {
      phase = 'menstruation';
      advice = 'Période de repos et de régénération. Écoute ton corps et sois douce avec toi-même.';
      quote = 'Ralentis pour mieux repartir.';
    } else if (dayOfCycle <= Math.floor(cycleLength * 0.5)) {
      phase = 'folliculaire';
      advice = 'Énergie croissante et motivation. C\'est le moment parfait pour commencer de nouveaux projets.';
      quote = 'Énergie montante — lance les nouvelles habitudes.';
    } else if (dayOfCycle <= Math.floor(cycleLength * 0.6)) {
      phase = 'ovulation';
      advice = 'Pic d\'énergie et de confiance. Profite de cette période pour les tâches importantes et sociales.';
      quote = 'Visibilité & confiance — vise les tâches sociales/difficiles.';
    } else {
      phase = 'lutéale';
      advice = 'Période de consolidation. Focus sur l\'organisation et la préparation du cycle suivant.';
      quote = 'Organisation & douceur — consolide, simplifie.';
    }

    return {
      phase,
      dayOfCycle,
      advice,
      quote,
      adjustments: getPhaseAdjustments(phase)
    };
  };

  const phaseInfo = useMemo(() => {
    return calculatePhaseInfo(cycleData.lastPeriodDate, cycleData.cycleLength);
  }, [cycleData.lastPeriodDate, cycleData.cycleLength]);

  const handleSaveSettings = () => {
    setCycleData(tempData);
    setShowSettings(false);
  };

  const getPhaseColor = (phase: CyclePhase) => {
    switch (phase) {
      case 'menstruation': return 'from-red-400 to-red-600';
      case 'folliculaire': return 'from-green-400 to-green-600';
      case 'ovulation': return 'from-yellow-400 to-orange-500';
      case 'lutéale': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getPhaseEmoji = (phase: CyclePhase) => {
    switch (phase) {
      case 'menstruation': return '🌙';
      case 'folliculaire': return '🌱';
      case 'ovulation': return '🌟';
      case 'lutéale': return '🍂';
      default: return '💫';
    }
  };

  const getPhaseName = (phase: CyclePhase) => {
    switch (phase) {
      case 'menstruation': return 'Menstruation';
      case 'folliculaire': return 'Phase Folliculaire';
      case 'ovulation': return 'Ovulation';
      case 'lutéale': return 'Phase Lutéale';
      default: return 'Phase inconnue';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Mon Cycle</h2>
        <p className="text-gray-600 dark:text-gray-300">Adapte tes routines selon ton cycle naturel</p>
      </div>

      {/* Settings Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            setTempData(cycleData);
            setShowSettings(true);
          }}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
        >
          <Settings className="w-5 h-5" />
          <span>Configurer mon cycle</span>
        </button>
      </div>

      {/* Settings Form */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-2 border-pink-200 dark:border-pink-600">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-pink-500" />
            <span>Configuration du cycle</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Date des dernières règles
              </label>
              <input
                type="date"
                value={tempData.lastPeriodDate}
                onChange={(e) => setTempData({...tempData, lastPeriodDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Durée du cycle (jours)
              </label>
              <input
                type="number"
                min="21"
                max="35"
                value={tempData.cycleLength}
                onChange={(e) => setTempData({...tempData, cycleLength: parseInt(e.target.value) || 28})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Généralement entre 21 et 35 jours</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveSettings}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase Information */}
      {phaseInfo ? (
        <div className="space-y-6">
          {/* Current Phase Card */}
          <div className={`bg-gradient-to-r ${getPhaseColor(phaseInfo.phase)} p-6 rounded-xl text-white shadow-2xl`}>
            <div className="text-center">
              <div className="text-4xl mb-2">{getPhaseEmoji(phaseInfo.phase)}</div>
              <h3 className="text-2xl font-bold mb-2">{getPhaseName(phaseInfo.phase)}</h3>
              <p className="text-lg mb-2">Jour {phaseInfo.dayOfCycle}/{cycleData.cycleLength}</p>
              <p className="text-white/90">{phaseInfo.advice}</p>
            </div>
          </div>

          {/* Quote Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Quote className="w-6 h-6 text-pink-500" />
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Citation du jour</h4>
            </div>
            <blockquote className="text-gray-700 dark:text-gray-300 text-lg italic text-center">
              "{phaseInfo.quote}"
            </blockquote>
          </div>

          {/* Phase Mood & Business Info */}
          {(() => {
            const info = getPhaseInfo(phaseInfo.phase);
            return (
              <div className={`bg-gradient-to-r ${info.cardColor} p-6 rounded-xl shadow-lg border-2 ${info.borderColor}`}>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Humeur actuelle</h4>
                    <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">{info.mood}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Message rassurant</h4>
                    <p className="text-gray-700 dark:text-gray-200">{info.message}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Orientation business</h4>
                    <p className="text-gray-700 dark:text-gray-200 text-sm italic">{info.businessOrientation}</p>
                  </div>
                </div>
              </div>
            );
          })()}
          {/* Adjustments Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Ajustements recommandés</h4>
            </div>
            <div className="space-y-2">
              {phaseInfo.adjustments.map((adjustment, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">{adjustment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cycle Progress */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-500" />
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Progression du cycle</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Jour {phaseInfo.dayOfCycle}</span>
                <span>{cycleData.cycleLength} jours</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className={`bg-gradient-to-r ${getPhaseColor(phaseInfo.phase)} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${(phaseInfo.dayOfCycle / cycleData.cycleLength) * 100}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                {Math.round((phaseInfo.dayOfCycle / cycleData.cycleLength) * 100)}% du cycle
              </div>
            </div>
          </div>

          {/* Next Phases Preview */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Prochaines phases</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['menstruation', 'folliculaire', 'ovulation', 'lutéale'] as CyclePhase[])
                .filter(phase => phase !== phaseInfo.phase)
                .slice(0, 2)
                .map((phase) => (
                  <div key={phase} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{getPhaseEmoji(phase)}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{getPhaseName(phase)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getPhaseAdjustments(phase)[0]}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Configure ton cycle pour commencer
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Renseigne la date de tes dernières règles pour adapter tes routines à ton cycle naturel
          </p>
        </div>
      )}
    </div>
  );
};

export default CycleTab;