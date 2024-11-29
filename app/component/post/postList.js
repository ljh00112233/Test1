import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const PostList = () => {
  const [posts, setPosts] = useState([
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState(''); // 작성자 입력 필드
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글
  const [newComment, setNewComment] = useState(''); // 댓글 입력

  const [listVisiable, setListVisiable] = useState(true);
  const [contentVisiable, setContentVisiable] = useState(false);

  const addPost = () => {
    if (newTitle.trim() && newContent.trim() && newAuthor.trim()) {
      const newPost = {
        id: String(posts.length + 1),
        title: newTitle,
        content: newContent,
        author: newAuthor, // 작성자 추가
        comments: [],
      };

      // 새로운 게시글을 가장 위에 추가
      setPosts([newPost, ...posts]);

      // 입력 필드 초기화
      setNewTitle('');
      setNewContent('');
      setNewAuthor('');
    } else {
      alert('제목, 내용, 작성자 모두 입력해주세요.');
    }
  };

  const handlePostPress = (post) => {
    setSelectedPost(post); // 게시글 클릭 시 해당 게시글을 선택
  };

  const addComment = () => {
    if (newComment.trim()) {
      // 댓글 추가 후, 해당 게시글의 댓글 목록을 갱신
      const updatedPosts = posts.map(post => 
        post.id === selectedPost.id 
          ? { ...post, comments: [...post.comments, newComment] } 
          : post
      );

      // posts 상태 업데이트하여 댓글이 바로 반영되도록 함
      setPosts(updatedPosts);

      // 댓글 입력 필드 초기화
      setNewComment('');
    } else {
      alert('댓글을 입력해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      {listVisiable && (
      <View>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <Text style={styles.title}>게시글 목록</Text>
          <TouchableOpacity onPress={() => {setListVisiable(false); setContentVisiable(true); setSelectedPost(false)}}>
            <Text>게시글 작성</Text>
          </TouchableOpacity>
        </View>

        {/* 게시글 목록을 FlatList로 렌더링 */}
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.post} onTouchEnd={() => handlePostPress(item)}>
              <Text style={styles.postTitle}>{item.title}</Text>  
              <Text style={styles.author}>작성자: {item.author}</Text> 
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>)}
      {/* 선택된 게시글 내용 표시 */}
      {selectedPost && (
        <ScrollView style={styles.selectedPost}>
          <Text style={styles.selectedTitle}>{selectedPost.title}</Text>
          <Text>작성자: {selectedPost.author}</Text>
          <Text>{selectedPost.content}</Text>



          {/* 댓글 목록 표시 */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>댓글:</Text>
            <FlatList
              data={selectedPost.comments}
              renderItem={({ item }) => <Text style={styles.comment}>{item}</Text>}  
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          {/* 댓글 입력 필드 */}
          <TextInput
            style={styles.input}
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="댓글 추가" onPress={addComment} />
        </ScrollView>
      )}

      {/* 게시글 추가 입력 */}
      {contentVisiable && (
      <View>
        <TextInput
          style={styles.input}
          placeholder="제목을 입력하세요"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="내용을 입력하세요"
          value={newContent}
          onChangeText={setNewContent}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="작성자 이름을 입력하세요"
          value={newAuthor}
          onChangeText={setNewAuthor}
        />
        <Button title="게시글 추가" onPress={() => {addPost(); setListVisiable(true); setContentVisiable(false);}} />
      </View>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  post: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: 'gray',
  },
  selectedPost: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  selectedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingLeft: 8,
    borderRadius: 4,
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comment: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#d0f0d0',
    borderRadius: 4,
  },
});

export default PostList;
