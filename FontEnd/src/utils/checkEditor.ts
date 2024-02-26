import { useMeQuery } from '@/services/auth';

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const checkEditor = () => {
    const router = useNavigate();
    const path = useLocation();

    const { data, isLoading } = useMeQuery();

    useEffect(() => {
        if (!isLoading) {
            if (data?.role === 'nhanvien' && path.pathname === '/nhanvien/') {
                router('/nhanvien')
            } else if (data?.role !== 'nhanvien'&& path.pathname !== '/nhanvien/' ) {
                router('/account/signin');
            }
        }
    }, [data, isLoading, router]);

    return { data, isLoading };
};