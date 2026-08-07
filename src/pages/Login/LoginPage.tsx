import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Box, Paper, TextField, Button, Typography, Alert, Link as MuiLink } from '@mui/material';
import { useState } from 'react';
import { auth } from '@/firebase/config';
import { color, font } from '@/theme/tokens';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(
    (location.state as { reason?: string })?.reason === 'not-authorized'
      ? 'This account does not have admin access.'
      : null,
  );
  const [resetSent, setResetSent] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate('/dashboard');
    } catch {
      setServerError('Incorrect email or password.');
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues('email');
    if (!email) {
      setServerError('Enter your email above first, then tap "Forgot password."');
      return;
    }
    await sendPasswordResetEmail(auth, email);
    setResetSent(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: color.bg }}>
      <Paper sx={{ p: 5, width: 380 }}>
        <Typography sx={{ fontFamily: font.display, fontWeight: 700, mb: 0.5 }} variant="h5">
          Share<Box component="span" sx={{ color: color.brand }}>Drive</Box>
        </Typography>
        <Typography variant="body2" sx={{ color: color.textSecondary, mb: 3 }}>
          Admin sign in
        </Typography>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
        {resetSent && <Alert severity="success" sx={{ mb: 2 }}>Password reset email sent.</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 2, py: 1.2 }}
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
          <MuiLink
            component="button"
            type="button"
            variant="body2"
            onClick={handleForgotPassword}
            sx={{ display: 'block', mt: 2, textAlign: 'center', color: color.textSecondary }}
          >
            Forgot password?
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  );
}
