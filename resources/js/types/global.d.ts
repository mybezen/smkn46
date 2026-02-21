import type { Auth } from '@/types/auth';
import type { Setting } from './models';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            setting: Setting;
            [key: string]: unknown;
        };
    }
}
