import { Link } from '@inertiajs/react';
import {
    Award,
    Image,
    LayoutGrid,
    GraduationCap,
    Trophy,
    Tag,
    FileText,
    Images,
    School,
    User,
    BookOpen,
    Eye,
    Network,
    ChevronRight,
} from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';

interface SubItem {
    title: string;
    href: string;
}

interface NavItemFlat {
    title: string;
    href: string;
    icon: React.ElementType;
}

interface NavItemGroup {
    title: string;
    icon: React.ElementType;
    children: SubItem[];
}

type NavEntry = NavItemFlat | NavItemGroup;

function isGroup(item: NavEntry): item is NavItemGroup {
    return 'children' in item;
}

const navItems: NavEntry[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'School Profile',
        icon: School,
        children: [
            { title: 'Headmaster', href: '/admin/profile/headmaster' },
            { title: 'Profile', href: '/admin/profile/profile' },
            { title: 'History', href: '/admin/profile/history' },
            { title: 'Vision & Mission', href: '/admin/profile/vision-mission' },
            { title: 'Organization Structure', href: '/admin/profile/organization-structure' },
        ],
    },
    {
        title: 'Achievements',
        href: '/admin/achievements',
        icon: Award,
    },
    {
        title: 'Banners',
        href: '/admin/banners',
        icon: Image,
    },
    {
        title: 'Majors',
        href: '/admin/majors',
        icon: GraduationCap,
    },
    {
        title: 'Extracurriculars',
        href: '/admin/extracurriculars',
        icon: Trophy,
    },
    {
        title: 'Articles',
        icon: FileText,
        children: [
            { title: 'All Articles', href: '/admin/articles' },
            { title: 'Categories', href: '/admin/categories' },
        ],
    },
    {
        title: 'Galleries',
        href: '/admin/galleries',
        icon: Images,
    },
];

function NavItemComponent({ item }: { item: NavEntry }) {
    const { url } = usePage();

    if (isGroup(item)) {
        const isAnyChildActive = item.children.some((child) =>
            url.startsWith(child.href),
        );

        return (
            <Collapsible defaultOpen={isAnyChildActive} className="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isAnyChildActive}
                            className="w-full"
                        >
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.children.map((child) => {
                                const isActive = url.startsWith(child.href);
                                return (
                                    <SidebarMenuSubItem key={child.href}>
                                        <SidebarMenuSubButton asChild isActive={isActive}>
                                            <Link href={child.href} prefetch>
                                                {child.title}
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                );
                            })}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        );
    }

    const isActive = url.startsWith(item.href) && item.href !== '/admin/dashboard'
        ? url.startsWith(item.href)
        : url === item.href;

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                <Link href={item.href} prefetch>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <NavItemComponent
                                    key={isGroup(item) ? item.title : item.href}
                                    item={item}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
