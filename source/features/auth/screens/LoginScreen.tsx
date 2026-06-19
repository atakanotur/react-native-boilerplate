import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Text } from 'react-native';
import { Screen } from "@/source/shared/components/layout";

export const LoginScreen = () => {
    const techStack = [
        { name: 'Expo Router', color: '#fff', bg: 'rgba(255,255,255,0.1)' },
        { name: 'Zustand', color: '#facc15', bg: 'rgba(250,204,21,0.1)' },
        { name: 'React Query', color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
        { name: 'Axios', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
        { name: 'Secure Store', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    ];

    return (
        <Screen withPadding={false} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>v1.0.0-Ready</Text>
                    </View>
                    <Text style={styles.title}>Ready to Build{'\n'}Something <Text style={styles.
                        highlight}>Epic?</Text></Text>
                    <Text style={styles.subtitle}>
                        Welcome to the create-rn-expo-starter world. We provide the foundation, you create the magic. 🚀
                    </Text>
                </View>

                {/* Tech Stack Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tech Stack</Text>
                    <View style={styles.stackGrid}>
                        {techStack.map((tech, index) => (
                            <View key={index} style={[styles.pill, {
                                backgroundColor: tech.bg, borderColor: tech.color +
                                    '40'
                            }]}>
                                <Text style={[styles.pillText, { color: tech.color }]}>{tech.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* How to Use Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Start</Text>
                    <View style={styles.terminalBox}>
                        {/* macOS style window dots */}
                        <View style={styles.terminalHeader}>
                            <View style={[styles.dot, { backgroundColor: '#ff5f56' }]} />
                            <View style={[styles.dot, { backgroundColor: '#ffbd2e' }]} />
                            <View style={[styles.dot, { backgroundColor: '#27c93f' }]} />
                        </View>

                        <View style={styles.stepContainer}>
                            <Text style={styles.stepNumber}>1.</Text>
                            <Text style={styles.stepText}>
                                Navigate to the <Text style={styles.codeHighlight}>app/</Text> folder and create your new
                                screens.
                            </Text>
                        </View>
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepNumber}>2.</Text>
                            <Text style={styles.stepText}>
                                Manage your global state inside <Text style={styles.codeHighlight}>store/</Text>.
                            </Text>
                        </View>
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepNumber}>3.</Text>
                            <Text style={styles.stepText}>
                                You can start by clearing the contents of this screen and building your login page here.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Call to Action (CTA) Section */}
            <View style={styles.ctaContainer}>
                <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
                    <Text style={styles.ctaText}>Explore the Code 💻</Text>
                </TouchableOpacity>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A', // Dark Theme                                                                        
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 120, // To prevent content from hiding behind the absolute CTA button                             
    },
    heroSection: {
        marginTop: 20,
        marginBottom: 40,
    },
    badgeContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(139, 92, 246, 0.15)', // Glassmorphism purple                                             
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
        marginBottom: 20,
    },
    badgeText: {
        color: '#a78bfa',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: '#F8FAFC',
        lineHeight: 50,
        marginBottom: 16,
        letterSpacing: -1,
    },
    highlight: {
        color: '#8B5CF6', // Neon accent                                                                                 
    },
    subtitle: {
        fontSize: 16,
        color: '#94A3B8',
        lineHeight: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 16,
    },
    stackGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
    },
    terminalBox: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    terminalHeader: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 8,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    stepNumber: {
        color: '#8B5CF6',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 12,
        marginTop: 2,
    },
    stepText: {
        color: '#CBD5E1',
        fontSize: 15,
        lineHeight: 24,
        flex: 1,
    },
    codeHighlight: {
        color: '#38BDF8',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
    },
    ctaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: 'rgba(15, 23, 42, 0.85)', // Semi-transparent background                                        
    },
    ctaButton: {
        backgroundColor: '#8B5CF6',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        // Neon glow effect                                                                                              
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8 as any,
    },
    ctaText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});                             