import AppLayout from '@/layouts/app-layout';
import { motion } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useRef, useState, ChangeEvent } from 'react';
import {
    Upload,
    Network,
    ImageIcon,
    CheckCircle2,
    Loader2,
    UserCircle2,
    Pencil,
    LayoutTemplate,
    User,
} from 'lucide-react';

interface Position {
    title: string | null;
    name: string | null;
    order: number | string;
    image: string | null;
}

interface OrgStructureData {
    positions: Position[];
}

interface OrgStructureRecord {
    title: string;
    data: OrgStructureData;
}

interface PageProps {
    organizationStructure: OrgStructureRecord | null;
    flash?: { success?: string };
    [key: string]: any;
}

interface PositionState {
    title: string | null;
    name: string | null;
    order: number;
    image: string | null;
    newImageFile: File | null;
    imagePreview: string | null;
}

const DISPLAY_ONLY_ORDERS = new Set([17, 18]);

const ORG_ROWS: { jabatan: string; order: number }[][] = [
    [{ jabatan: 'Kepala Sekolah', order: 1 }],
    [
        { jabatan: 'Ketua Komite', order: 2 },
        { jabatan: 'Kasubag Tata Usaha', order: 3 },
    ],
    [
        { jabatan: 'Wakasekbid. Kurikulum', order: 4 },
        { jabatan: 'Wakasekbid. Kesiswaan', order: 5 },
        { jabatan: 'Wakasekbid. Hubin dan Kemitraan', order: 6 },
        { jabatan: 'Wakasekbid. Sarana dan Prasarana', order: 7 },
    ],
    [
        { jabatan: 'K3K Akuntansi', order: 8 },
        { jabatan: 'K3K Perkantoran', order: 9 },
        { jabatan: 'K3K Bisnis Ritel', order: 10 },
        { jabatan: 'K3K DKV', order: 11 },
        { jabatan: 'K3K RPL', order: 12 },
    ],
    [
        { jabatan: 'Kepala Perpustakaan', order: 13 },
        { jabatan: 'Pembina OSIS', order: 14 },
        { jabatan: 'Ka. Unit Produksi', order: 15 },
        { jabatan: 'Ka. Laboratorium', order: 16 },
        { jabatan: 'Wali Kelas', order: 17 },
        { jabatan: 'Guru & Tendik', order: 18 },
    ],
];

const TOTAL_POSITIONS = 18;

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: easeOut },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: easeOut, delay: 0.04 * i },
    }),
};

function buildInitialPositions(
    record: OrgStructureRecord | null,
): PositionState[] {
    const existing = record?.data?.positions ?? [];

    const byOrder = new Map<number, Position>();
    existing.forEach((p) => byOrder.set(Number(p.order), p));

    return Array.from({ length: TOTAL_POSITIONS }, (_, i) => {
        const order = i + 1;
        const p = byOrder.get(order);
        return {
            title: p?.title ?? null,
            name: p?.name ?? null,
            order,
            image: p?.image ?? null,
            newImageFile: null,
            imagePreview: p?.image ? `/storage/${p.image}` : null,
        };
    });
}

function EmptyAvatar() {
    return <User className="h-full w-full text-gray-200" />;
}

interface PositionCardProps {
    pos: PositionState;
    jabatan: string;
    index: number;
    animIndex: number;
    onImageChange: (index: number, e: ChangeEvent<HTMLInputElement>) => void;
    onNameChange: (index: number, value: string) => void;
    fileInputRef: (el: HTMLInputElement | null) => void;
    onUploadClick: () => void;
    compact?: boolean;
    displayOnly?: boolean;
}

function PositionCard({
    pos,
    jabatan,
    index,
    animIndex,
    onImageChange,
    onNameChange,
    fileInputRef,
    onUploadClick,
    compact = false,
    displayOnly = false,
}: PositionCardProps) {
    return (
        <motion.div
            custom={animIndex}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
        >
            <Card
                className={`h-full rounded-2xl border-gray-200 py-0 shadow-sm transition-shadow duration-200 ${
                    displayOnly
                        ? 'cursor-default bg-gray-50/60 opacity-80'
                        : 'hover:shadow-md'
                }`}
            >
                <CardContent
                    className={`space-y-2 ${compact ? 'p-2.5' : 'p-3'}`}
                >
                    <div className="text-center">
                        <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] leading-tight font-semibold text-blue-700">
                            {jabatan}
                        </span>
                    </div>

                    <div>
                        {displayOnly ? (
                            <EmptyAvatar />
                        ) : pos.imagePreview ? (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative mb-1.5 aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                            >
                                <img
                                    src={pos.imagePreview}
                                    alt={pos.name || jabatan}
                                    className="h-full w-full object-cover"
                                />
                                {pos.newImageFile && (
                                    <div className="absolute top-1 right-1">
                                        <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                            New
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="mb-1.5 flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
                                <ImageIcon className="h-5 w-5 text-gray-300" />
                                <span className="text-[10px] text-gray-400">
                                    No photo yet
                                </span>
                            </div>
                        )}

                        {!displayOnly && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png,image/webp"
                                    onChange={(e) => onImageChange(index, e)}
                                    className="hidden"
                                />

                                <motion.div whileTap={{ scale: 0.97 }}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={onUploadClick}
                                        className="h-7 w-full rounded-xl border-gray-200 px-2 text-[10px] text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <Upload className="mr-1 h-3 w-3" />
                                        {pos.imagePreview
                                            ? 'Change Photo'
                                            : 'Upload Photo'}
                                    </Button>
                                </motion.div>
                            </>
                        )}

                        {displayOnly && (
                            <div className="flex h-7 w-full items-center justify-center rounded-xl border border-dashed border-gray-200">
                                <span className="text-[9px] text-gray-400 italic">
                                    Display only
                                </span>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-gray-500">
                            Name
                        </Label>
                        {displayOnly ? (
                            <div className="flex h-8 items-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-2">
                                <span className="text-[10px] text-gray-400 italic">
                                    —
                                </span>
                            </div>
                        ) : (
                            <Input
                                placeholder="Full name"
                                value={pos.name ?? ''}
                                onChange={(e) =>
                                    onNameChange(index, e.target.value)
                                }
                                className="h-8 rounded-xl border-gray-200 text-xs placeholder:text-xs focus:border-blue-400"
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ConnectorLine() {
    return (
        <div className="flex justify-center py-1">
            <div className="h-8 w-px bg-blue-200" />
        </div>
    );
}

export default function OrganizationStructureIndex() {
    const { organizationStructure, flash } = usePage<PageProps>().props;

    const [sectionTitle, setSectionTitle] = useState<string>(
        organizationStructure?.title ?? '',
    );

    const [positions, setPositions] = useState<PositionState[]>(
        buildInitialPositions(organizationStructure),
    );

    const [processing, setProcessing] = useState<boolean>(false);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleImageChange = (
        index: number,
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setPositions((prev) =>
            prev.map((p, i) =>
                i === index
                    ? { ...p, newImageFile: file, imagePreview: preview }
                    : p,
            ),
        );
    };

    const handleNameChange = (index: number, value: string) => {
        setPositions((prev) =>
            prev.map((p, i) => (i === index ? { ...p, name: value } : p)),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', sectionTitle);

        positions.forEach((pos, index) => {
            formData.append(`positions[${index}][title]`, pos.title ?? '');
            formData.append(`positions[${index}][name]`, pos.name ?? '');
            formData.append(`positions[${index}][order]`, String(pos.order));
            if (pos.newImageFile) {
                formData.append(`positions[${index}][image]`, pos.newImageFile);
            }
        });

        router.post('/admin/profile/organization-structure', formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    let animCounter = 0;

    return (
        <AppLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="min-h-screen bg-gray-50/40 p-4 md:p-8"
            >
                {/* Page Header */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <Network className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Organization Structure
                            </h1>
                            <p className="mt-0.5 text-sm text-gray-500">
                                Manage positions and members of the school's
                                organization structure
                            </p>
                        </div>
                    </div>
                    <Separator className="mt-6" />
                </div>

                {flash?.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        {flash.success}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* ── Section Title ── */}
                        <Card className="rounded-2xl border-gray-200 shadow-sm">
                            <CardContent className="px-5 py-3">
                                <div className="flex flex-col gap-3">
                                    <Label
                                        htmlFor="section-title"
                                        className="text-sm font-semibold text-gray-700"
                                    >
                                        Section Title
                                    </Label>
                                    <Input
                                        id="section-title"
                                        name="title"
                                        placeholder="ex: Struktur Organisasi Sekolah"
                                        value={sectionTitle}
                                        onChange={(e) =>
                                            setSectionTitle(e.target.value)
                                        }
                                        className="max-w-xl rounded-xl border-gray-200 placeholder:text-gray-400 focus:border-blue-400"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* ── CHART ── */}
                        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="mb-6 text-center text-xs font-semibold tracking-widest text-gray-400 uppercase">
                                Organization Structure Chart
                            </p>

                            <div className="flex min-w-[640px] flex-col items-center gap-0">
                                {/* ── Row 1: Kepala Sekolah ── */}
                                {(() => {
                                    const row = ORG_ROWS[0];
                                    return (
                                        <div className="flex w-full justify-center gap-4">
                                            {row.map(({ jabatan, order }) => {
                                                const idx = order - 1;
                                                const ai = animCounter++;
                                                const isDisplayOnly =
                                                    DISPLAY_ONLY_ORDERS.has(
                                                        order,
                                                    );
                                                return (
                                                    <div
                                                        key={order}
                                                        className="w-44"
                                                    >
                                                        <PositionCard
                                                            pos={positions[idx]}
                                                            jabatan={jabatan}
                                                            index={idx}
                                                            animIndex={ai}
                                                            onImageChange={
                                                                handleImageChange
                                                            }
                                                            onNameChange={
                                                                handleNameChange
                                                            }
                                                            fileInputRef={(
                                                                el,
                                                            ) => {
                                                                fileInputRefs.current[
                                                                    idx
                                                                ] = el;
                                                            }}
                                                            onUploadClick={() =>
                                                                fileInputRefs.current[
                                                                    idx
                                                                ]?.click()
                                                            }
                                                            displayOnly={
                                                                isDisplayOnly
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}

                                <ConnectorLine />

                                {/* ── Row 2: Ketua Komite & Kasubag TU ── */}
                                {(() => {
                                    const row = ORG_ROWS[1];
                                    return (
                                        <>
                                            <div className="mb-0 flex w-full items-center justify-center">
                                                <div className="flex flex-1 justify-end pr-0">
                                                    <div className="h-px w-[25%] bg-blue-200" />
                                                </div>
                                                <div className="h-0 w-px bg-blue-200" />
                                                <div className="flex flex-1 justify-start pl-0">
                                                    <div className="h-px w-[25%] bg-blue-200" />
                                                </div>
                                            </div>

                                            <div className="flex w-full justify-center gap-24">
                                                {row.map(
                                                    ({ jabatan, order }) => {
                                                        const idx = order - 1;
                                                        const ai =
                                                            animCounter++;
                                                        const isDisplayOnly =
                                                            DISPLAY_ONLY_ORDERS.has(
                                                                order,
                                                            );
                                                        return (
                                                            <div
                                                                key={order}
                                                                className="flex flex-col items-center"
                                                            >
                                                                <div className="h-4 w-px bg-blue-200" />
                                                                <div className="w-40">
                                                                    <PositionCard
                                                                        pos={
                                                                            positions[
                                                                                idx
                                                                            ]
                                                                        }
                                                                        jabatan={
                                                                            jabatan
                                                                        }
                                                                        index={
                                                                            idx
                                                                        }
                                                                        animIndex={
                                                                            ai
                                                                        }
                                                                        onImageChange={
                                                                            handleImageChange
                                                                        }
                                                                        onNameChange={
                                                                            handleNameChange
                                                                        }
                                                                        fileInputRef={(
                                                                            el,
                                                                        ) => {
                                                                            fileInputRefs.current[
                                                                                idx
                                                                            ] =
                                                                                el;
                                                                        }}
                                                                        onUploadClick={() =>
                                                                            fileInputRefs.current[
                                                                                idx
                                                                            ]?.click()
                                                                        }
                                                                        displayOnly={
                                                                            isDisplayOnly
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </>
                                    );
                                })()}

                                <ConnectorLine />

                                {/* ── Row 3: 4 Wakasekbid ── */}
                                {(() => {
                                    const row = ORG_ROWS[2];
                                    return (
                                        <div className="flex w-full flex-wrap justify-center gap-3">
                                            {row.map(({ jabatan, order }) => {
                                                const idx = order - 1;
                                                const ai = animCounter++;
                                                const isDisplayOnly =
                                                    DISPLAY_ONLY_ORDERS.has(
                                                        order,
                                                    );
                                                return (
                                                    <div
                                                        key={order}
                                                        className="w-36"
                                                    >
                                                        <PositionCard
                                                            pos={positions[idx]}
                                                            jabatan={jabatan}
                                                            index={idx}
                                                            animIndex={ai}
                                                            onImageChange={
                                                                handleImageChange
                                                            }
                                                            onNameChange={
                                                                handleNameChange
                                                            }
                                                            fileInputRef={(
                                                                el,
                                                            ) => {
                                                                fileInputRefs.current[
                                                                    idx
                                                                ] = el;
                                                            }}
                                                            onUploadClick={() =>
                                                                fileInputRefs.current[
                                                                    idx
                                                                ]?.click()
                                                            }
                                                            compact
                                                            displayOnly={
                                                                isDisplayOnly
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}

                                <ConnectorLine />

                                {/* ── Row 4: 5 K3K ── */}
                                {(() => {
                                    const row = ORG_ROWS[3];
                                    return (
                                        <div className="flex w-full flex-wrap justify-center gap-2.5">
                                            {row.map(({ jabatan, order }) => {
                                                const idx = order - 1;
                                                const ai = animCounter++;
                                                const isDisplayOnly =
                                                    DISPLAY_ONLY_ORDERS.has(
                                                        order,
                                                    );
                                                return (
                                                    <div
                                                        key={order}
                                                        className="w-36"
                                                    >
                                                        <PositionCard
                                                            pos={positions[idx]}
                                                            jabatan={jabatan}
                                                            index={idx}
                                                            animIndex={ai}
                                                            onImageChange={
                                                                handleImageChange
                                                            }
                                                            onNameChange={
                                                                handleNameChange
                                                            }
                                                            fileInputRef={(
                                                                el,
                                                            ) => {
                                                                fileInputRefs.current[
                                                                    idx
                                                                ] = el;
                                                            }}
                                                            onUploadClick={() =>
                                                                fileInputRefs.current[
                                                                    idx
                                                                ]?.click()
                                                            }
                                                            compact
                                                            displayOnly={
                                                                isDisplayOnly
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}

                                <ConnectorLine />

                                {/* ── Row 5: 6 posisi ── */}
                                {(() => {
                                    const row = ORG_ROWS[4];
                                    return (
                                        <div className="flex w-full flex-wrap justify-center gap-2.5">
                                            {row.map(({ jabatan, order }) => {
                                                const idx = order - 1;
                                                const ai = animCounter++;
                                                const isDisplayOnly =
                                                    DISPLAY_ONLY_ORDERS.has(
                                                        order,
                                                    );
                                                return (
                                                    <div
                                                        key={order}
                                                        className="w-[150px]"
                                                    >
                                                        <PositionCard
                                                            pos={positions[idx]}
                                                            jabatan={jabatan}
                                                            index={idx}
                                                            animIndex={ai}
                                                            onImageChange={
                                                                handleImageChange
                                                            }
                                                            onNameChange={
                                                                handleNameChange
                                                            }
                                                            fileInputRef={(
                                                                el,
                                                            ) => {
                                                                fileInputRefs.current[
                                                                    idx
                                                                ] = el;
                                                            }}
                                                            onUploadClick={() =>
                                                                fileInputRefs.current[
                                                                    idx
                                                                ]?.click()
                                                            }
                                                            compact
                                                            displayOnly={
                                                                isDisplayOnly
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}

                                <ConnectorLine />

                                {/* ── Row 6: Peserta Didik (display only) ── */}
                                <motion.div
                                    custom={animCounter++}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-white shadow-md shadow-blue-100">
                                        <UserCircle2 className="h-5 w-5 opacity-80" />
                                        <span className="text-base font-bold tracking-wide">
                                            Peserta Didik
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-2">
                            <motion.div whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 rounded-xl bg-blue-600 px-8 font-medium text-white shadow-sm shadow-blue-200 hover:bg-blue-700"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </form>
            </motion.div>
        </AppLayout>
    );
}
