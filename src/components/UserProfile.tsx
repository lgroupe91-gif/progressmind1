import React, { useState } from 'react';
import { User, Crown, Calendar, Trophy, Target, X, Edit3, Check, Mail, MapPin, Phone } from 'lucide-react';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Alex Martin',
    email: 'alex.martin@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    joinDate: '2024-01-15',
    bio: 'Passionné de développement personnel et de productivité. En quête d\'équilibre et de croissance continue.'
  });

  const [editInfo, setEditInfo] = useState(userInfo);

  const subscriptionInfo = {
    plan: 'Premium',
    status: 'active',
    nextBilling: '2024-02-15',
    price: '9.99€/mois',
    features: [
      'Routines illimitées',
      'Objectifs SMART avancés',
      'Statistiques détaillées',
      'Notifications personnalisées',
      'Sauvegarde cloud',
      'Support prioritaire'
    ]
  };

  const stats = {
    totalRoutines: 12,
    completedToday: 8,
    currentStreak: 15,
    totalGoals: 6,
    completedGoals: 2,
    joinDays: Math.floor((new Date().getTime() - new Date(userInfo.joinDate).getTime()) / (1000 * 60 * 60 * 24))
  };

  const handleSaveEdit = () => {
    setUserInfo(editInfo);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditInfo(userInfo);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white rounded-t-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Mon Profil</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{userInfo.name}</h3>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-300" />
                <span className="text-sm">{subscriptionInfo.plan}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">Informations personnelles</h4>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="text-green-500 hover:text-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editInfo.email}
                    onChange={(e) => setEditInfo({...editInfo, email: e.target.value})}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  />
                ) : (
                  <span className="text-gray-700">{userInfo.email}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editInfo.phone}
                    onChange={(e) => setEditInfo({...editInfo, phone: e.target.value})}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  />
                ) : (
                  <span className="text-gray-700">{userInfo.phone}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editInfo.location}
                    onChange={(e) => setEditInfo({...editInfo, location: e.target.value})}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  />
                ) : (
                  <span className="text-gray-700">{userInfo.location}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  Membre depuis {stats.joinDays} jours
                </span>
              </div>
            </div>

            {isEditing && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editInfo.bio}
                  onChange={(e) => setEditInfo({...editInfo, bio: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  rows={3}
                />
              </div>
            )}

            {!isEditing && userInfo.bio && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{userInfo.bio}</p>
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Mes statistiques</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalRoutines}</div>
                <div className="text-xs text-blue-700">Routines créées</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
                <div className="text-xs text-green-700">Terminées aujourd'hui</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
                <div className="text-xs text-orange-700">Série actuelle</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.completedGoals}</div>
                <div className="text-xs text-purple-700">Objectifs atteints</div>
              </div>
            </div>
          </div>

          {/* Abonnement */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Mon abonnement</h4>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-800">{subscriptionInfo.plan}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-700">{subscriptionInfo.price}</div>
                  <div className="text-xs text-purple-600">
                    {subscriptionInfo.status === 'active' ? '✅ Actif' : '❌ Inactif'}
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-purple-700 mb-3">
                Prochain paiement : {new Date(subscriptionInfo.nextBilling).toLocaleDateString('fr-FR')}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-purple-800 mb-2">Fonctionnalités incluses :</div>
                {subscriptionInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs text-purple-700">
                    <span className="text-green-500">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                Gérer l'abonnement
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
              Exporter mes données
            </button>
            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;