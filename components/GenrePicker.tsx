import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GENRE_CATEGORIES, SUBGENRES, GenreCategory } from '../constants/genres';

interface GenrePickerProps {
  category: GenreCategory | '';
  genre: string;
  onChange: (category: GenreCategory, genre: string) => void;
}

export default function GenrePicker({ category, genre, onChange }: GenrePickerProps) {
  const [openCategory, setOpenCategory] = useState(false);
  const [openGenre, setOpenGenre] = useState(false);

  const subgenreOptions = category ? SUBGENRES[category as GenreCategory] : [];

  const selectCategory = (cat: GenreCategory) => {
    // Reset genre when category changes since subgenre lists differ per category
    onChange(cat, '');
    setOpenCategory(false);
    setOpenGenre(true);
  };

  const selectGenre = (g: string) => {
    onChange(category as GenreCategory, g);
    setOpenGenre(false);
  };

  return (
    <View style={styles.wrapper}>
      {/* Category picker */}
      <Text style={styles.inputLabel}>Category</Text>
      <TouchableOpacity
        style={styles.genrePicker}
        onPress={() => { setOpenCategory(!openCategory); setOpenGenre(false); }}
      >
        <Text style={category ? styles.genreSelected : styles.genrePlaceholder}>
          {category || 'Select a category'}
        </Text>
        <Text style={styles.genreChevron}>{openCategory ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {openCategory && (
        <View style={styles.genreDropdown}>
          <ScrollView style={styles.genreScroll} nestedScrollEnabled>
            {GENRE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.genreOption, category === cat && styles.genreOptionSelected]}
                onPress={() => selectCategory(cat)}
              >
                <Text style={[styles.genreOptionText, category === cat && styles.genreOptionTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Subgenre picker — only shown once a category is chosen */}
      {category !== '' && (
        <>
          <Text style={styles.inputLabel}>Genre</Text>
          <TouchableOpacity
            style={styles.genrePicker}
            onPress={() => { setOpenGenre(!openGenre); setOpenCategory(false); }}
          >
            <Text style={genre ? styles.genreSelected : styles.genrePlaceholder}>
              {genre || 'Select a genre'}
            </Text>
            <Text style={styles.genreChevron}>{openGenre ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {openGenre && (
            <View style={styles.genreDropdown}>
              <ScrollView style={styles.genreScroll} nestedScrollEnabled>
                {subgenreOptions.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genreOption, genre === g && styles.genreOptionSelected]}
                    onPress={() => selectGenre(g)}
                  >
                    <Text style={[styles.genreOptionText, genre === g && styles.genreOptionTextSelected]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#8888AA', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: -4 },
  genrePicker: { backgroundColor: '#0F0F1A', borderRadius: 10, borderWidth: 1, borderColor: '#2A2A44', padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  genreSelected: { color: '#F5F5F5', fontSize: 15 },
  genrePlaceholder: { color: '#555577', fontSize: 15 },
  genreChevron: { color: '#8888AA', fontSize: 12 },
  genreDropdown: { backgroundColor: '#0F0F1A', borderRadius: 10, borderWidth: 1, borderColor: '#2A2A44', maxHeight: 220 },
  genreScroll: { padding: 8 },
  genreOption: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  genreOptionSelected: { backgroundColor: '#2A1A00' },
  genreOptionText: { color: '#8888AA', fontSize: 14 },
  genreOptionTextSelected: { color: '#E8A838', fontWeight: '700' },
});