const Admin = () => {
    const { user, refresh: refreshAuth } = useAuth();
    const [active, setActive] = useState("sato_operations");
    const [data, setData] = useState({ sato_operations: [], sato_judiciary: [], sato_archives: [], sato_profiles: [] });

    const refresh = async () => {
        if (!SUPABASE_CONFIGURED) return;
        const [ops, jud, arc, prof] = await Promise.all([
            supabase.from("sato_operations").select("*").order("threat_level", { ascending: false }),
            supabase.from("sato_judiciary").select("*").order("created_at", { ascending: false }),
            supabase.from("sato_archives").select("*").order("year", { ascending: true }),
            supabase.from("sato_profiles").select("*").order("clearance_level", { ascending: false }),
        ]);
        setData({
            sato_operations: ops.data || [],
            sato_judiciary: jud.data || [],
            sato_archives: arc.data || [],
            sato_profiles: prof.data || [],
        });
    };

    // --- REALTIME FIX START ---
    useEffect(() => {
        refresh(); // Initial load

        const channel = supabase
            .channel('admin-realtime-sync')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'sato_operations' },
                () => refresh()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'sato_judiciary' },
                () => refresh()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'sato_archives' },
                () => refresh()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'sato_profiles' },
                () => refresh()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);
    // --- REALTIME FIX END ---

    // ... (rest of your component remains the same)
