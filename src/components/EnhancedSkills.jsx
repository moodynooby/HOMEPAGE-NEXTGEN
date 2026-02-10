import { useMemo } from 'react';
import { Box, Typography, Chip, Paper, Skeleton } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import BrushIcon from '@mui/icons-material/Brush';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';

import { useGitHubCache } from '@/hooks/useGitHubCache';

const skillCategories = {
  frontend: {
    label: 'Frontend',
    icon: BrushIcon,
    color: '#3b82f6',
    keywords: [
      'javascript',
      'typescript',
      'react',
      'vue',
      'html',
      'css',
      'frontend',
      'ui',
      'web',
    ],
  },
  backend: {
    label: 'Backend',
    icon: StorageIcon,
    color: '#10b981',
    keywords: [
      'node',
      'python',
      'api',
      'server',
      'database',
      'backend',
      'express',
      'django',
      'flask',
    ],
  },
  systems: {
    label: 'Systems',
    icon: BuildIcon,
    color: '#f59e0b',
    keywords: [
      'c++',
      'c',
      'embedded',
      'arduino',
      'raspberry',
      'iot',
      'hardware',
      'systems',
    ],
  },
  ml: {
    label: 'ML & Data',
    icon: CodeIcon,
    color: '#8b5cf6',
    keywords: [
      'machine learning',
      'ml',
      'ai',
      'tensorflow',
      'pytorch',
      'data',
      'pandas',
      'numpy',
      'scikit',
    ],
  },
};

function categorizeSkills(repos) {
  if (!repos) return {};

  const categories = {
    frontend: new Set(),
    backend: new Set(),
    systems: new Set(),
    ml: new Set(),
  };

  repos.forEach((repo) => {
    const text = `${repo.name} ${repo.description || ''} ${repo.language || ''} ${repo.topics?.join(' ') || ''}`.toLowerCase();

    Object.entries(skillCategories).forEach(([category, config]) => {
      config.keywords.forEach((keyword) => {
        if (text.includes(keyword)) {
          if (repo.language) {
            categories[category].add(repo.language);
          }
          categories[category].add(keyword);
        }
      });
    });

    if (repo.language) {
      if (['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue'].includes(repo.language)) {
        categories.frontend.add(repo.language);
      }
      if (['Python', 'Go', 'Ruby', 'PHP', 'Java'].includes(repo.language)) {
        categories.backend.add(repo.language);
      }
      if (['C', 'C++', 'Rust'].includes(repo.language)) {
        categories.systems.add(repo.language);
      }
    }
  });

  return {
    frontend: Array.from(categories.frontend).slice(0, 5),
    backend: Array.from(categories.backend).slice(0, 5),
    systems: Array.from(categories.systems).slice(0, 5),
    ml: Array.from(categories.ml).slice(0, 5),
  };
}

function SkillCategory({ category, skills, delay }) {
  const config = skillCategories[category];
  const Icon = config.icon;

  if (skills.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: (theme) => theme.shadows[4],
            borderColor: config.color,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.5,
          }}
        >
          <Icon sx={{ color: config.color, fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {config.label}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {skills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              sx={{
                bgcolor: `${config.color}15`,
                color: config.color,
                fontWeight: 500,
                fontSize: '0.75rem',
                '&:hover': {
                  bgcolor: `${config.color}25`,
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </motion.div>
  );
}

SkillCategory.propTypes = {
  category: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  delay: PropTypes.number,
};

SkillCategory.defaultProps = {
  delay: 0,
};

function LoadingSkeleton() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 3 }} />
      ))}
    </Box>
  );
}

export default function EnhancedSkills({ username }) {
  const { reposData, loading } = useGitHubCache(username);

  const skills = useMemo(() => categorizeSkills(reposData), [reposData]);

  if (loading) {
    return (
      <Box sx={{ py: 2 }}>
        <LoadingSkeleton />
      </Box>
    );
  }

  const hasSkills = Object.values(skills).some((arr) => arr.length > 0);
  if (!hasSkills) return null;

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
        <CodeIcon sx={{ fontSize: 24, color: 'text.primary' }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: 'text.primary' }}
        >
          Skills from GitHub
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
          },
          gap: 2,
        }}
      >
        {Object.entries(skills).map(([category, categorySkills], index) => (
          <SkillCategory
            key={category}
            category={category}
            skills={categorySkills}
            delay={index * 0.1}
          />
        ))}
      </Box>
    </Box>
  );
}

EnhancedSkills.propTypes = {
  username: PropTypes.string.isRequired,
};
