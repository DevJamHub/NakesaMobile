import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, View, type TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PracticeCard } from '@/components/PracticeCard';
import { SearchBar } from '@/components/SearchBar';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { colors, spacing } from '@/constants/theme';
import { useAccount } from '@/features/auth/AuthProvider';
import { listProfessions, searchPractices } from '@/features/practice/practice-service';
import { useAsync } from '@/hooks/useAsync';
import { friendlyError } from '@/lib/errors';
import type { PracticeSummary } from '@/types/domain';

const PAGE_SIZE = 20;

type ExtraPages = { key: string; items: PracticeSummary[]; done: boolean; error: string | null };
const noExtra = (key: string): ExtraPages => ({ key, items: [], done: false, error: null });

export default function ExploreScreen() {
  const account = useAccount();
  // From Home: a category (`profession`, with `at` changing on every tap) or the search bar (`focus`).
  const params = useLocalSearchParams<{ profession?: string; at?: string; focus?: string }>();
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [profession, setProfession] = useState<string | null>(params.profession ?? null);
  const inputRef = useRef<TextInput>(null);

  // A category tapped on Home arrives as a route param (also when this tab is already open).
  // `at` makes every tap new, so the same category applies again after choosing "Semua" here.
  const categoryTap = `${params.profession ?? ''}@${params.at ?? ''}`;
  const [tapSeen, setTapSeen] = useState(categoryTap);
  if (categoryTap !== tapSeen) {
    setTapSeen(categoryTap);
    if (params.profession) setProfession(params.profession);
  }

  // The search bar on Home opens this tab ready for typing, also when it was open before.
  useEffect(() => {
    if (params.focus) inputRef.current?.focus();
  }, [params.focus]);

  // Search shortly after the patient stops typing.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(text.trim()), 350);
    return () => clearTimeout(timer);
  }, [text]);

  const professions = useAsync(listProfessions, 'professions');
  const search = { query, profession, city: account.city };
  const searchKey = `${query}:${profession ?? ''}:${account.city ?? ''}`;
  const results = useAsync(() => searchPractices({ ...search, limit: PAGE_SIZE }), searchKey);

  // Further pages are appended when the list is scrolled to the end. They belong to one
  // search; a new search (or pull to refresh) starts from the first page again.
  const [extra, setExtra] = useState<ExtraPages>(noExtra(''));
  const pages = extra.key === searchKey ? extra : noExtra(searchKey);
  const [loadingMore, setLoadingMore] = useState(false);
  const items = [...(results.data ?? []), ...pages.items];
  const hasMore = !pages.done && (results.data?.length ?? 0) >= PAGE_SIZE;

  const loadMore = async () => {
    if (!hasMore || loadingMore || results.loading || !results.data) return;
    const key = searchKey;
    setLoadingMore(true);
    try {
      const page = await searchPractices({ ...search, limit: PAGE_SIZE, offset: items.length });
      setExtra((prev) => ({
        key,
        items: [...(prev.key === key ? prev.items : []), ...page],
        done: page.length < PAGE_SIZE,
        error: null,
      }));
    } catch (e) {
      setExtra((prev) => ({ ...(prev.key === key ? prev : noExtra(key)), error: friendlyError(e) }));
    } finally {
      setLoadingMore(false);
    }
  };

  const refresh = () => {
    setExtra(noExtra(searchKey));
    results.refresh();
  };

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <View style={styles.top}>
        <AppText variant="title">Cari</AppText>
        <SearchBar
          value={text}
          onChangeText={setText}
          onSubmit={() => setQuery(text.trim())}
          autoFocus={!!params.focus}
          inputRef={inputRef}
        />
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="Semua" selected={!profession} onPress={() => setProfession(null)} />
          {professions.data?.map((p) => (
            <Chip
              key={p.key}
              label={`${p.icon} ${p.label}`}
              selected={profession === p.key}
              onPress={() => setProfession(profession === p.key ? null : p.key)}
            />
          ))}
        </ScrollView>
      </View>

      {results.loading ? (
        <LoadingState message="Mencari…" />
      ) : results.error ? (
        <ErrorState message={results.error} onRetry={results.reload} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl refreshing={results.refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          ListHeaderComponent={
            items.length ? (
              <AppText variant="small">
                {query || profession ? 'Hasil pencarian' : account.city ? `Praktik di ${account.city} tampil lebih dulu` : 'Semua praktik'}
              </AppText>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Praktik tidak ditemukan"
              message={query || profession ? 'Coba kata lain atau pilih kategori “Semua”.' : 'Belum ada praktik yang bergabung.'}
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={colors.primary} style={styles.footer} />
            ) : pages.error ? (
              <AppText variant="small" center color={colors.danger} style={styles.footer} onPress={loadMore}>
                {pages.error} Ketuk untuk mencoba lagi.
              </AppText>
            ) : null
          }
          renderItem={({ item }) => (
            <PracticeCard practice={item} onPress={() => router.push({ pathname: '/practice/[id]', params: { id: item.id } })} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.md },
  chips: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md, flexGrow: 1 },
  footer: { padding: spacing.lg },
});
