import { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Skeleton,
  Alert,
  IconButton,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import FolderIcon from '@mui/icons-material/Folder';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';

import { useGitHubCache } from '@/hooks/useGitHubCache';

const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  React: '#61dafb',
};

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          minWidth: { xs: 80, sm: 100 },
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Icon sx={{ fontSize: 28, color }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: 'text.primary' }}
        >
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Paper>
    </motion.div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

StatCard.defaultProps = {
  delay: 0,
};

function LoadingSkeleton() {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width={100}
          height={100}
          sx={{ borderRadius: 2 }}
        />
      ))}
    </Box>
  );
}

export default function GitHubStats({ username }) {
  const { userData, reposData, loading, error, refresh } =
    useGitHubCache(username);

  const stats = useMemo(() => {
    if (!userData || !reposData) return null;

    const totalStars = reposData.reduce(
      (acc, repo) => acc + repo.stargazers_count,
      0,
    );
    const totalForks = reposData.reduce(
      (acc, repo) => acc + repo.forks_count,
      0,
    );

    const languages = reposData
      .filter((repo) => repo.language)
      .reduce((acc, repo) => {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
        return acc;
      }, {});

    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      repos: userData.public_repos,
      stars: totalStars,
      forks: totalForks,
      followers: userData.followers,
      following: userData.following,
      topLanguages,
    };
  }, [userData, reposData]);

  if (loading) {
    return (
      <Box sx={{ py: 2 }}>
        <LoadingSkeleton />
      </Box>
    );
  }

  if (error && !stats) {
    return (
      <Alert
        severity="error"
        action={
          <IconButton color="inherit" size="small" onClick={refresh}>
            <RefreshIcon />
          </IconButton>
        }
      >
        {error.message}
      </Alert>
    );
  }

  if (!stats) return null;

  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 3,
        }}
      >
        <GitHubIcon sx={{ fontSize: 28, color: 'text.primary' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          GitHub Stats
        </Typography>
        <IconButton size="small" onClick={refresh} sx={{ ml: 1 }}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <StatCard
          icon={FolderIcon}
          label="Repos"
          value={stats.repos}
          color="#6366f1"
          delay={0}
        />
        <StatCard
          icon={StarIcon}
          label="Stars"
          value={stats.stars}
          color="#fbbf24"
          delay={0.1}
        />
        <StatCard
          icon={ForkRightIcon}
          label="Forks"
          value={stats.forks}
          color="#8b5cf6"
          delay={0.2}
        />
      </Box>

      {stats.topLanguages.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 2,
            }}
          >
            <CodeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Top Languages
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {stats.topLanguages.map(([lang, count]) => (
              <Chip
                key={lang}
                label={`${lang} (${count})`}
                size="small"
                sx={{
                  bgcolor: `${languageColors[lang] || '#6366f1'}20`,
                  color: languageColors[lang] || '#6366f1',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: `${languageColors[lang] || '#6366f1'}30`,
                  },
                }}
              />
            ))}
          </Box>
        </motion.div>
      )}
    </Box>
  );
}

GitHubStats.propTypes = {
  username: PropTypes.string.isRequired,
};
