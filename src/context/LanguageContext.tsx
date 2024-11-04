import React, { createContext, useState, useContext } from 'react';

type Language = 'en' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: typeof translations;
}

// Translations object
export const translations = {
  en: {
    // Admin Dashboard
    adminDashboard: 'Admin Dashboard',
    carTracking: 'Car GPS Tracking',
    carManagement: 'Car Management',
    maintenanceAlerts: 'Maintenance Alerts',
    dailyReport: 'Daily Report',
    userManagement: 'User Management',
    analytics: 'Analytics',
    trackVehicles: 'Track all vehicles in real-time on map',
    manageFleet: 'Add, edit, or remove vehicles from the fleet',
    monitorMaintenance: 'Monitor vehicle maintenance schedules and alerts',
    viewActivities: 'View detailed daily car activities and statistics',
    manageAccounts: 'Manage client accounts and permissions',
    trackRevenue: 'Track revenue and rental statistics',

    // Client Dashboard
    clientDashboard: 'Client Dashboard',
    availableCars: 'Available Cars',
    reservations: 'Reservations',
    browseCars: 'Browse and search available vehicles',
    manageReservations: 'Make and manage your car reservations',
    logout: 'Logout',

    // Common
    back: 'Back',
    cancel: 'Cancel',
    submit: 'Submit',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
  },
  fr: {
    // Admin Dashboard
    adminDashboard: 'Tableau de Bord Admin',
    carTracking: 'Suivi GPS des Voitures',
    carManagement: 'Gestion des Voitures',
    maintenanceAlerts: 'Alertes de Maintenance',
    dailyReport: 'Rapport Quotidien',
    userManagement: 'Gestion des Utilisateurs',
    analytics: 'Analytiques',
    trackVehicles: 'Suivre tous les véhicules en temps réel sur la carte',
    manageFleet: 'Ajouter, modifier ou supprimer des véhicules de la flotte',
    monitorMaintenance: 'Surveiller les calendriers et alertes de maintenance',
    viewActivities: 'Voir les activités quotidiennes détaillées',
    manageAccounts: 'Gérer les comptes clients et les permissions',
    trackRevenue: 'Suivre les revenus et statistiques de location',

    // Client Dashboard
    clientDashboard: 'Tableau de Bord Client',
    availableCars: 'Voitures Disponibles',
    reservations: 'Réservations',
    browseCars: 'Parcourir et rechercher les véhicules disponibles',
    manageReservations: 'Faire et gérer vos réservations',
    logout: 'Déconnexion',

    // Common
    back: 'Retour',
    cancel: 'Annuler',
    submit: 'Soumettre',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    search: 'Rechercher',
  },
  ar: {
    // Admin Dashboard
    adminDashboard: 'لوحة تحكم المشرف',
    carTracking: 'تتبع السيارات عبر GPS',
    carManagement: 'إدارة السيارات',
    maintenanceAlerts: 'تنبيهات الصيانة',
    dailyReport: 'التقرير اليومي',
    userManagement: 'إدارة المستخدمين',
    analytics: 'التحليلات',
    trackVehicles: 'تتبع جميع المركبات في الوقت الفعلي على الخريطة',
    manageFleet: 'إضافة أو تعديل أو إزالة المركبات من الأسطول',
    monitorMaintenance: 'مراقبة جداول وتنبيهات الصيانة',
    viewActivities: 'عرض الأنشطة اليومية التفصيلية',
    manageAccounts: 'إدارة حسابات العملاء والصلاحيات',
    trackRevenue: 'تتبع الإيرادات وإحصائيات التأجير',

    // Client Dashboard
    clientDashboard: 'لوحة تحكم العميل',
    availableCars: 'السيارات المتاحة',
    reservations: 'الحجوزات',
    browseCars: 'تصفح وبحث السيارات المتاحة',
    manageReservations: 'إجراء وإدارة حجوزات السيارات',
    logout: 'تسجيل الخروج',

    // Common
    back: 'رجوع',
    cancel: 'إلغاء',
    submit: 'إرسال',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    search: 'بحث',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translations: translations
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 