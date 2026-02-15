import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  GitHub,
  Star,
  People,
  Code,
  Refresh,
  GetApp,
  Group,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';

import { fetchGitHubStats, fetchAddonStats } from '@/utils/statsApi';
import projects from '@/content/projects.json';

const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => {
  const theme = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: 8,
          background: theme.palette.mode === 'light'
            ? `linear-gradient(135deg, ${color}11 0%, ${theme.palette.background.paper} 100%)`
            : `linear-gradient(135deg, ${color}22 0%, ${theme.palette.background.paper} 100%)`,
          border: `1px solid ${color}33`,
          boxShadow: `0 4px 20px ${color}11`,
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 1.5,
              borderRadius: 4,
              bgcolor: `${color}22`,
              color: color,
              mb: 2,
            }}
          >
            <Icon fontSize="large" />
          </Box>
          <Typography variant="h4" fontWeight="800" gutterBottom>
            {value.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            {label}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function GitHubStats({ username = 'moodynooby' }) {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [addonStats, setAddonStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      if (forceRefresh) {
        localStorage.removeItem(`github_stats_${username}`);
        projects.forEach(p => {
          if (p.addonId) localStorage.removeItem(`addon_stats_${p.addonId}`);
        });
      }

      const ghData = await fetchGitHubStats(username);
      setStats(ghData);

      const addonProjects = projects.filter(p => p.addonId);
      const addonData = await Promise.all(
        addonProjects.map(async (p) => {
          const s = await fetchAddonStats(p.addonId);
          return { ...s, name: p.githubName };
        }),
      );
      setAddonStats(addonData);
    } catch (err) {
      setError('Failed to load real-time stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [username]);

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
        <IconButton onClick={() => loadData(true)} color="primary">
          <Refresh />
        </IconButton>
      </Box>
    );
  }

  const totalAddonUsers = addonStats.reduce((acc, s) => acc + s.dailyUsers, 0);
  const totalAddonDownloads = addonStats.reduce((acc, s) => acc + s.weeklyDownloads, 0);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="700">Live Impact</Typography>
        <Tooltip title="Refresh Stats">
          <span>
            <IconButton onClick={() => loadData(true)} disabled={loading} color="primary">
              <Refresh className={loading ? 'spin-animation' : ''} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(4)).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 8 }} />
            </Grid>
          ))
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={Star}
                label="GitHub Stars"
                value={stats?.totalStars || 0}
                color={theme.palette.primary.main}
                delay={0.1}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={People}
                label="Followers"
                value={stats?.followers || 0}
                color={theme.palette.secondary.main}
                delay={0.2}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={Group}
                label="Daily Add-on Users"
                value={totalAddonUsers}
                color="#10B981"
                delay={0.3}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={GetApp}
                label="Weekly Downloads"
                value={totalAddonDownloads}
                color="#3B82F6"
                delay={0.4}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>Recent Activity</Typography>
              <Grid container spacing={2}>
                {stats?.recentRepos.map((repo, i) => (
                  <Grid size={{ xs: 12, md: 4 }} key={repo.name}>
                    <Card variant="outlined" sx={{ borderRadius: 1, bgcolor: 'transparent' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="700" noWrap>
                          {repo.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                          height: 40,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mb: 1,
                        }}>
                          {repo.description || 'No description provided.'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star fontSize="small" sx={{ color: 'gold' }} />
                            <Typography variant="caption">{repo.stars}</Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            component="a"
                            href={repo.url}
                            target="_blank"
                            sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}
                          >
                            View Repo →
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </>
        )}
      </Grid>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </Box>
  );
}
