import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { approveDriver, rejectDriver, getDocumentUrl } from '@/services/adminApi';

export function useApproveDriver() {
  return useMutation({
    mutationFn: (driverId: string) => approveDriver(driverId),
    onSuccess: () => toast.success('Driver approved'),
    onError: (err) => toast.error(`Could not approve driver: ${err.message}`),
  });
}

export function useRejectDriver() {
  return useMutation({
    mutationFn: (vars: { driverId: string; reason: string }) => rejectDriver(vars.driverId, vars.reason),
    onSuccess: () => toast.success('Driver rejected'),
    onError: (err) => toast.error(`Could not reject driver: ${err.message}`),
  });
}

export function useViewDocument() {
  return useMutation({
    mutationFn: (storagePath: string) => getDocumentUrl(storagePath),
    onError: (err) => toast.error(`Could not load document: ${err.message}`),
  });
}
