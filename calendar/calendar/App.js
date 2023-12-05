import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput,ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

LocaleConfig.defaultLocale = 'en';

const CalendarApp = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [note, setNote] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [savedNotes, setSavedNotes] = useState([]);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  const handleDateChange = date => {
    if (date && date.dateString) {
      setSelectedDate(date.dateString);
    }
  };

  const handleAddNote = () => {
    setModalVisible(true);
  };

const handleSaveNote = () => {
  if (selectedDate) {
    // Xử lý trường hợp ghi chú đã tồn tại cho ngày đã chọn
    const existingNoteIndex = savedNotes.findIndex(note => note.date === selectedDate);

    if (existingNoteIndex !== -1) {
      // Ghi chú đã tồn tại, cập nhật nội dung
      const updatedNotes = [...savedNotes];
      updatedNotes[existingNoteIndex].content = note;
      setSavedNotes(updatedNotes);
      setNote('');
    } else {
      // Ghi chú chưa tồn tại, thêm mới
      const newNote = { date: selectedDate, content: note };
      setSavedNotes([...savedNotes, newNote]);
      setMarkedDates({
        ...markedDates,
        [selectedDate]: { selected: true, selectedColor: 'black' },
      });
    }

    console.log(`Ghi chú cho ngày ${selectedDate}: ${note}`);
    setModalVisible(false);
    setNote('');
  }
};

const handleDeleteNote = (index) => {
  const updatedNotes = [...savedNotes];
  updatedNotes.splice(index, 1);
  setSavedNotes(updatedNotes);
      setMarkedDates({
        ...markedDates,
        [selectedDate]: { selected:false, selectedColor: 'white' },
      });
};
const handleUpdateNote = () => {
  if (editingNoteIndex !== null) {
    const updatedNotes = [...savedNotes];
    updatedNotes[editingNoteIndex].content = editingNoteContent;
    setSavedNotes(updatedNotes);
    setEditingNoteIndex(null);
    setEditingNoteContent('');
    setModalVisible(false);
    setNote('');
  }
};
const handleEditNote = (index) => {
  setEditingNoteIndex(index);
  setEditingNoteContent(savedNotes[index].content);
  setModalVisible(true);
};

const handleMark = () => {
      setMarkedDates({
        ...markedDates,
        [selectedDate]: { selected: true, selectedColor: 'black' },
      });
};

const handleMarkDel = () => {
      setMarkedDates({
        ...markedDates,
        [selectedDate]: { selected:false, selectedColor: 'white' },
      });

};


  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDateChange}
        monthFormat={'MMMM yyyy'}
        hideExtraDays={true}
        hideArrows={false}
        markedDates={{ ...markedDates, [selectedDate]: { selected: true, selectedColor: 'lightblue' } }}

      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
        <Text style={styles.buttonText}>Thêm ghi chú</Text>
      </TouchableOpacity>
      <View style={styles.mark}>
      <TouchableOpacity style={styles.addButton} onPress={handleMark}>
        <Text style={styles.buttonText}>Đánh dấu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleMarkDel}>
        <Text style={styles.buttonText}>Bỏ đánh dấu</Text>
      </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
<TextInput
  style={styles.noteInput}
  multiline
  placeholder="Nhập ghi chú của bạn"
  value={editingNoteContent !== '' ? editingNoteContent : note}
  onChangeText={(text) => (editingNoteIndex !== null ? setEditingNoteContent(text) : setNote(text))}
/>
<TouchableOpacity style={styles.saveButton} onPress={editingNoteIndex !== null ? handleUpdateNote : handleSaveNote}>
  <Text style={styles.buttonText}>{editingNoteIndex !== null ? 'Cập nhật' : 'Lưu'}</Text>
</TouchableOpacity>
        </View>
      </Modal>
      <ScrollView>
      {savedNotes.map((savedNote, index) => (
        <View key={index} style={styles.savedNoteContainer}>
          <Text style={styles.textNote}>{`Ngày ${savedNote.date}: ${savedNote.content}`}</Text>
          <TouchableOpacity onPress={() => handleEditNote(index)}>
            <Text style={styles.editButton}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteNote(index)}>
            <Text style={styles.deleteButton}>Xóa</Text>
          </TouchableOpacity>
        </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  mark:{
    flexDirection:'row',
    justifyContent:'space-evenly',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  noteInput: {
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#00DFA2',
    padding: 15,
    alignItems: 'center',
    borderRadius:5,
  },
  savedNoteContainer: {
    marginTop: 10,
    flexDirection: 'column',
  },
  textNote:{
    fontSize:16,
    marginLeft:20,
  },
  deleteButton: {
    backgroundColor: '#D2001A',
    padding:10,
    alignItems: 'center',
    marginTop: 10,
    width:'100%',
    textAlign:'center',
    fontSize:16,
    color:'#EFEFEF',
  },
  editButton: {
    backgroundColor: '#22092C',
    padding:10,
    alignItems: 'center',
    marginTop: 10,
    width:'100%',
    textAlign:'center',
    fontSize:16,
    color:'white',
  },
});

export default CalendarApp;