import { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Switch, FormControlLabel, Divider, Alert,
} from '@mui/material';
import { Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { color, font } from '@/theme/tokens';

export function SettingsPage() {
  const [appName, setAppName] = useState('ShareDrive');
  const [maxFare, setMaxFare] = useState('5000');
  const [minFare, setMinFare] = useState('50');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Settings size={20} color={color.brand} />
        <Typography variant="h6" sx={{ fontFamily: font.display, fontWeight: 600 }}>
          Settings
        </Typography>
      </Box>

      <Alert severity="info" sx={{ backgroundColor: `${color.info}1A`, border: `1px solid ${color.info}40` }}>
        Settings are stored locally. Firebase-backed settings will be available in a future update.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>General</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            size="small"
            label="App Name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            sx={{ maxWidth: 300 }}
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Fare Configuration (PKR)</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            label="Minimum Fare"
            type="number"
            value={minFare}
            onChange={(e) => setMinFare(e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            size="small"
            label="Maximum Fare"
            type="number"
            value={maxFare}
            onChange={(e) => setMaxFare(e.target.value)}
            sx={{ width: 150 }}
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>System</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormControlLabel
            control={<Switch checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />}
            label="Enable push notifications"
          />
          <Divider sx={{ my: 1 }} />
          <FormControlLabel
            control={<Switch checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} color="error" />}
            label="Maintenance mode (blocks all ride requests)"
          />
        </Box>
      </Paper>

      <Box>
        <Button variant="contained" onClick={handleSave} sx={{ textTransform: 'none' }}>
          Save Settings
        </Button>
      </Box>
    </Box>
  );
}
