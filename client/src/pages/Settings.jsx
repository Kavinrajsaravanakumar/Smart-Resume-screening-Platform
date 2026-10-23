import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Sparkles,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  User,
  Palette,
  Sun,
  Moon,
  KeyRound,
  ShieldCheck,
  Star,
  Check,
  ChevronDown,
} from 'lucide-react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

const educationLevels = ["Any", "High School", "Associate", "Bachelor's", "Master's", "Doctorate"];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // ─── User Profile & Password States ───
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswordBlock, setShowPasswordBlock] = useState(false);

  // Sync profile form state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setRole(user.role || 'HR Recruiter');
    }
  }, [user]);

  // Smooth scroll to #user-account on mount or hash change
  useEffect(() => {
    const checkHashAndScroll = () => {
      if (window.location.hash === '#user-account') {
        const el = document.getElementById('user-account');
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    checkHashAndScroll();
    window.addEventListener('hashchange', checkHashAndScroll);
    return () => window.removeEventListener('hashchange', checkHashAndScroll);
  }, []);

  // ─── Job Scoring Profile States ───
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rescoring, setRescoring] = useState(false);

  // New skill addition state
  const [skillInput, setSkillInput] = useState('');
  const [skillWeight, setSkillWeight] = useState(3);
  const [skillMandatory, setSkillMandatory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Fetch profiles and existing candidate skills on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [profRes, candRes] = await Promise.all([
          api.get('/job-profiles'),
          api.get('/candidates'),
        ]);

        const profList = profRes?.data || [];
        setProfiles(profList);

        const active = profList.find(p => p.isActive) || profList[0] || null;
        if (active) {
          setActiveProfileId(active._id);
          setSelectedProfile(JSON.parse(JSON.stringify(active)));
        }

        // Extract unique skills from candidates for autocomplete
        const cands = candRes?.data || [];
        const skillsSet = new Set();
        cands.forEach(c => {
          if (Array.isArray(c.skills)) {
            c.skills.forEach(s => {
              if (typeof s === 'string' && s.trim()) skillsSet.add(s.trim());
            });
          }
        });
        // Common industry skills
        [
          'React',
          'Node.js',
          'Python',
          'TypeScript',
          'JavaScript',
          'AWS',
          'Docker',
          'PostgreSQL',
          'MongoDB',
          'SQL',
          'Git',
          'Kubernetes',
          'Express',
          'Tailwind CSS',
        ].forEach(s => skillsSet.add(s));
        setCandidateSkills(Array.from(skillsSet).sort());
      } catch (err) {
        console.error('Failed to load settings data:', err);
        toast.error('Failed to load job profiles');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  // Handle Save User Profile
  const handleSaveProfileInfo = async (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      toast.error('Full name cannot be empty');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', {
        name: name.trim(),
        role: role.trim() || 'HR Recruiter',
      });

      if (res?.data) {
        updateUser(res.data);
      }
      toast.success('User account profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Save Password
  const handleSavePassword = async (e) => {
    e?.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Current password and new password are required');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    setSavingPassword(true);
    try {
      await api.put('/auth/password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordBlock(false);
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  // When profile selection switches
  const handleSelectProfile = (id) => {
    const prof = profiles.find(p => p._id === id);
    if (prof) {
      setActiveProfileId(prof._id);
      setSelectedProfile(JSON.parse(JSON.stringify(prof)));
    }
  };

  // Live total calculation for category weights
  const weightsTotal = useMemo(() => {
    if (!selectedProfile?.weights) return 0;
    const {
      skills = 0,
      experience = 0,
      education = 0,
      projects = 0,
      certifications = 0,
    } = selectedProfile.weights;
    return (
      Number(skills) +
      Number(experience) +
      Number(education) +
      Number(projects) +
      Number(certifications)
    );
  }, [selectedProfile?.weights]);

  // Autocomplete suggestions
  const filteredSuggestions = useMemo(() => {
    if (!skillInput.trim()) return [];
    const query = skillInput.toLowerCase();
    const existingNames = new Set(
      (selectedProfile?.requiredSkills || []).map(s => s.name.toLowerCase())
    );
    return candidateSkills
      .filter(s => s.toLowerCase().includes(query) && !existingNames.has(s.toLowerCase()))
      .slice(0, 6);
  }, [skillInput, candidateSkills, selectedProfile?.requiredSkills]);

  // Add required skill
  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    const exists = (selectedProfile.requiredSkills || []).some(
      s => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      toast.error(`Skill "${trimmed}" is already in required skills`);
      return;
    }

    const newSkillItem = {
      name: trimmed,
      weight: Number(skillWeight),
      mandatory: Boolean(skillMandatory),
    };

    setSelectedProfile(prev => ({
      ...prev,
      requiredSkills: [...(prev.requiredSkills || []), newSkillItem],
    }));

    setSkillInput('');
    setSkillWeight(3);
    setSkillMandatory(false);
    setShowSuggestions(false);
  };

  // Remove required skill
  const handleRemoveSkill = (index) => {
    setSelectedProfile(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index),
    }));
  };

  // Update category weight
  const handleWeightChange = (category, value) => {
    const num = Math.max(0, Math.min(100, Number(value) || 0));
    setSelectedProfile(prev => ({
      ...prev,
      weights: {
        ...(prev.weights || {}),
        [category]: num,
      },
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!selectedProfile?.title?.trim()) {
      toast.error('Profile title cannot be empty');
      return;
    }
    if (weightsTotal !== 100) {
      toast.error(`Weights must total exactly 100% (currently ${weightsTotal}%)`);
      return;
    }

    setSaving(true);
    try {
      const isNew = selectedProfile._id?.startsWith('new-');
      let saved;

      if (isNew) {
        const payload = { ...selectedProfile };
        delete payload._id;
        const res = await api.post('/job-profiles', payload);
        saved = res?.data;
        toast.success(`Created new profile: "${saved.title}"`);
      } else {
        const res = await api.put(`/job-profiles/${selectedProfile._id}`, selectedProfile);
        saved = res?.data;
        toast.success(`Saved profile: "${saved.title}"`);
      }

      // Refresh profiles list
      const refreshed = await api.get('/job-profiles');
      setProfiles(refreshed?.data || []);
      if (saved) {
        setActiveProfileId(saved._id);
        setSelectedProfile(JSON.parse(JSON.stringify(saved)));
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // Save & Re-score all candidates
  const handleSaveAndRescore = async () => {
    if (!selectedProfile?.title?.trim()) {
      toast.error('Profile title cannot be empty');
      return;
    }
    if (weightsTotal !== 100) {
      toast.error(`Weights must total exactly 100% (currently ${weightsTotal}%)`);
      return;
    }

    setRescoring(true);
    try {
      // 1. Save changes first
      let currentId = selectedProfile._id;
      if (!currentId || currentId.startsWith('new-')) {
        const payload = { ...selectedProfile, isActive: true };
        delete payload._id;
        const createRes = await api.post('/job-profiles', payload);
        currentId = createRes?.data?._id;
      } else {
        await api.put(`/job-profiles/${currentId}`, { ...selectedProfile, isActive: true });
      }

      // 2. Trigger rescore endpoint
      const rescoreRes = await api.post(`/job-profiles/${currentId}/rescore`);
      const updatedCount = rescoreRes?.data?.updatedCount || 0;

      // 3. Refresh state
      const profList = await api.get('/job-profiles');
      setProfiles(profList?.data || []);
      const active = (profList?.data || []).find(p => p._id === currentId);
      if (active) {
        setActiveProfileId(active._id);
        setSelectedProfile(JSON.parse(JSON.stringify(active)));
      }

      toast.success(
        `Profile saved & rescored ${updatedCount} candidate${updatedCount === 1 ? '' : 's'}!`
      );
    } catch (err) {
      console.error('Error rescoring candidates:', err);
      toast.error(err.message || 'Failed to rescore candidates');
    } finally {
      setRescoring(false);
    }
  };

  // Create new profile template
  const handleCreateNew = () => {
    const newProfile = {
      _id: `new-${Date.now()}`,
      title: 'New Job Profile',
      requiredSkills: [
        { name: 'JavaScript', weight: 4, mandatory: true },
        { name: 'React', weight: 4, mandatory: false },
      ],
      minExperienceYears: 2,
      preferredEducation: "Bachelor's",
      weights: {
        skills: 50,
        experience: 20,
        education: 15,
        projects: 10,
        certifications: 5,
      },
      isActive: false,
    };
    setSelectedProfile(newProfile);
    setActiveProfileId(newProfile._id);
  };

  // Delete profile
  const handleDeleteProfile = async (id) => {
    if (profiles.length <= 1) {
      toast.error('Cannot delete the only job profile');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this profile?')) return;

    try {
      await api.delete(`/job-profiles/${id}`);
      toast.success('Job profile deleted');
      const updatedList = await api.get('/job-profiles');
      const list = updatedList?.data || [];
      setProfiles(list);
      const nextActive = list.find(p => p.isActive) || list[0];
      if (nextActive) {
        setActiveProfileId(nextActive._id);
        setSelectedProfile(JSON.parse(JSON.stringify(nextActive)));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete profile');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-surface-500">Loading settings & scoring profiles...</p>
      </div>
    );
  }

  const isNewProfile = selectedProfile?._id?.startsWith('new-');

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Settings & Preferences"
        description="Manage your account profile, credentials, and customize job scoring evaluation rules"
      />

      {/* ── Top Section: User Account (id="user-account") & Appearance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Account Section (Col Span 2) */}
        <div id="user-account" className="lg:col-span-2">
          <GlassCard className="p-6 h-full flex flex-col justify-between" hover={false}>
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-200/50 dark:border-surface-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-glass">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-surface-900 dark:text-white">
                      User Account
                    </h2>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      Update your name and role to reflect across the platform
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                  {user?.name
                    ? user.name
                        .split(/\s+/)
                        .map(n => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'HR'}
                </div>
              </div>

              {/* Profile Edit Form */}
              <form onSubmit={handleSaveProfileInfo} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Sarah Mitchell"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5 block">
                      Email Address (Read-only)
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={user?.email || ''}
                      title="Email address cannot be changed"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800/60 border border-surface-200/80 dark:border-surface-700/80 text-sm text-surface-500 dark:text-surface-400 cursor-not-allowed outline-none select-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5 block">
                    Role / Job Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. HR Director, Senior Technical Recruiter"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none transition-all"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordBlock(prev => !prev)}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    {showPasswordBlock ? 'Hide Change Password' : 'Change Password'}
                  </button>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand shadow-glass hover:shadow-glass-lg transition-all disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>

              {/* Optional Collapsible Change Password Block */}
              <AnimatePresence>
                {showPasswordBlock && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-5 pt-5 border-t border-surface-200/50 dark:border-surface-700/50 overflow-hidden"
                  >
                    <h3 className="text-xs font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-brand-500" />
                      Update Password
                    </h3>
                    <form onSubmit={handleSavePassword} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-surface-600 dark:text-surface-400 mb-1 block">
                            Current Password
                          </label>
                          <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            className="w-full px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-surface-600 dark:text-surface-400 mb-1 block">
                            New Password
                          </label>
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-surface-600 dark:text-surface-400 mb-1 block">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                            className="w-full px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={savingPassword}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-800 dark:bg-surface-700 hover:bg-surface-900 text-white transition-all disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {savingPassword && <RefreshCw className="w-3 h-3 animate-spin" />}
                          Update Password
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* Appearance Card (Col Span 1) */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 h-full flex flex-col justify-between" hover={false}>
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-200/50 dark:border-surface-700/50">
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-glass">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-surface-900 dark:text-white">
                    Appearance
                  </h2>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Switch interface theme
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-brand-500" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">Theme</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-brand-500' : 'bg-surface-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: theme === 'dark' ? 28 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                  />
                </motion.button>
              </div>

              <div className="p-3 rounded-xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-500/20 text-xs text-surface-600 dark:text-surface-300 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-brand-700 dark:text-brand-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                  <span>Isolated HR Session</span>
                </div>
                <p className="text-[11px] text-surface-500 leading-relaxed">
                  Your candidate records, custom scoring criteria, and notes are securely scoped to your account.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ── Bottom Section: Scoring Profile Configuration (Full Width) ── */}
      <GlassCard className="p-6" hover={false}>
        {/* Header & Profile Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-surface-200/50 dark:border-surface-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-glass flex-shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-surface-900 dark:text-white flex items-center gap-2">
                <span>Job Scoring Profile</span>
                {selectedProfile?.isActive && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20">
                    Active System Profile
                  </span>
                )}
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Tailor how candidates are evaluated across skills, experience, and education
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {profiles.length > 0 && (
              <select
                value={activeProfileId || ''}
                onChange={e => handleSelectProfile(e.target.value)}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                {profiles.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.title} {p.isActive ? '(Active)' : ''}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-500/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
            {!isNewProfile && profiles.length > 1 && (
              <button
                onClick={() => handleDeleteProfile(selectedProfile._id)}
                title="Delete profile"
                className="p-2 rounded-xl text-surface-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {selectedProfile && (
          <div className="space-y-6 pt-6">
            {/* Title & Experience & Education Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5 block">
                  Profile / Job Title
                </label>
                <input
                  type="text"
                  value={selectedProfile.title || ''}
                  onChange={e =>
                    setSelectedProfile(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5 block">
                  Minimum Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={selectedProfile.minExperienceYears ?? 0}
                  onChange={e =>
                    setSelectedProfile(prev => ({
                      ...prev,
                      minExperienceYears: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5 block">
                  Preferred Education
                </label>
                <select
                  value={selectedProfile.preferredEducation || "Bachelor's"}
                  onChange={e =>
                    setSelectedProfile(prev => ({ ...prev, preferredEducation: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
                >
                  {educationLevels.map(lvl => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Weights Sliders (Must Total 100) */}
            <div className="p-4 rounded-2xl bg-surface-50/70 dark:bg-surface-800/40 border border-surface-200/50 dark:border-surface-700/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                    Category Weights (Must Total 100%)
                  </h3>
                  <p className="text-[11px] text-surface-500 dark:text-surface-400">
                    Set the relative importance of each dimension when computing candidate score
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    weightsTotal === 100
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {weightsTotal === 100 ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  Total: {weightsTotal}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { key: 'skills', label: 'Skills Match', desc: 'Required & parsed skills' },
                  { key: 'experience', label: 'Experience Years', desc: 'Work history depth' },
                  { key: 'education', label: 'Education Level', desc: 'Degree attainment' },
                  { key: 'projects', label: 'Projects', desc: 'Portfolio demonstration' },
                  { key: 'certifications', label: 'Certifications', desc: 'Verified credentials' },
                ].map(({ key, label, desc }) => {
                  const val = selectedProfile.weights?.[key] ?? 0;
                  return (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-white dark:bg-surface-800 border border-surface-200/60 dark:border-surface-700/60 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-surface-900 dark:text-white">
                          {label}
                        </span>
                        <span className="font-bold text-brand-600 dark:text-brand-400">{val}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={val}
                        onChange={e => handleWeightChange(key, e.target.value)}
                        className="w-full accent-brand-500 cursor-pointer"
                      />
                      <p className="text-[10px] text-surface-400 truncate">{desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Required Skills Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                    Required Technical Skills
                  </h3>
                  <p className="text-[11px] text-surface-500 dark:text-surface-400">
                    Skills the AI engine will search for in uploaded resumes. Mandatory skills will cap candidate score if missing.
                  </p>
                </div>
                <span className="text-xs text-surface-500">
                  {(selectedProfile.requiredSkills || []).length} skills defined
                </span>
              </div>

              {/* Add Skill Form with Autocomplete */}
              <div className="relative">
                <form
                  onSubmit={handleAddSkill}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                >
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={skillInput}
                      onChange={e => {
                        setSkillInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Type a skill (e.g. React, Go, Docker)..."
                      className="w-full px-3 py-2 rounded-xl bg-transparent text-sm text-surface-900 dark:text-white placeholder-surface-400 outline-none"
                    />

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-surface-800 rounded-xl shadow-glass-lg border border-surface-200 dark:border-surface-700 py-1.5 z-30 max-h-48 overflow-y-auto">
                        <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-surface-400">
                          Suggested from Talent Pool
                        </p>
                        {filteredSuggestions.map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setSkillInput(s);
                              setShowSuggestions(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center justify-between"
                          >
                            <span>{s}</span>
                            <Plus className="w-3 h-3 text-surface-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 px-2">
                    {/* Weight rating (1-5) */}
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-surface-500 mr-1">Weight:</span>
                      {[1, 2, 3, 4, 5].map(w => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setSkillWeight(w)}
                          className={`w-6 h-6 rounded-md text-xs font-bold transition-all ${
                            skillWeight >= w
                              ? 'bg-brand-500 text-white'
                              : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>

                    {/* Mandatory checkbox */}
                    <label className="flex items-center gap-1.5 text-xs text-surface-700 dark:text-surface-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={skillMandatory}
                        onChange={e => setSkillMandatory(e.target.checked)}
                        className="rounded border-surface-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                      />
                      <span className="text-[11px] font-semibold">Mandatory</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!skillInput.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-semibold gradient-brand text-white shadow-glass disabled:opacity-40 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </form>
              </div>

              {/* Skills Chips Grid */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(selectedProfile.requiredSkills || []).map((skill, idx) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border text-xs ${
                      skill.mandatory
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                        : 'bg-surface-50 dark:bg-surface-800/80 border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100'
                    }`}
                  >
                    <span className="font-semibold">{skill.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/10 font-mono">
                      wt:{skill.weight || 3}
                    </span>
                    {skill.mandatory && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-200 dark:bg-rose-900/60 font-bold text-rose-700 dark:text-rose-300">
                        Mandatory
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-surface-500 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
                {(selectedProfile.requiredSkills || []).length === 0 && (
                  <p className="text-xs text-surface-400 italic py-2">
                    No required skills specified yet. Add at least 1-2 skills above.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons: Save Profile & Save & Re-score */}
            <div className="pt-4 border-t border-surface-200/50 dark:border-surface-700/50 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving || rescoring}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-800 dark:text-white transition-all disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save Profile
              </button>

              <button
                type="button"
                onClick={handleSaveAndRescore}
                disabled={saving || rescoring}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand shadow-glass hover:shadow-glass-lg transition-all disabled:opacity-50"
              >
                {rescoring ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Save & Re-score All Candidates
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
