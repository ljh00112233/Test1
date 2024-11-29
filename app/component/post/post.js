import React, { useState, useEffect } from "react";
import { View, Text, TextInput, SafeAreaView, FlatList, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import { database } from "./firebase";
import { ref, push, onValue, remove, update } from "firebase/database";
import { Link } from "expo-router";

export default function post() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentUsername, setCommentUsername] = useState("");
  const [commentPassword, setCommentPassword] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);

  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [actionType, setActionType] = useState(""); // "edit" or "delete"
  const [targetPost, setTargetPost] = useState(null); // Target post or comment
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [currentAdminPassword, setCurrentAdminPassword] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState(""); // 현재 관리자 비밀번호를 Firebase에서 가져옴

  // Firebase에서 현재 관리자 비밀번호 가져오기
  useEffect(() => {
    const adminPasswordRef = ref(database, "adminPassword");
    onValue(adminPasswordRef, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        setAdminPassword(data.adminPassword);
      } else {
        setAdminPassword('admin1234');
      }
    });
  }, []);

  // 관리자 비밀번호 변경
  const changeAdminPassword = () => {
    if (currentAdminPassword !== adminPassword) {
      Alert.alert("오류", "현재 비밀번호가 올바르지 않습니다.");
      return;
    }

    if (!newAdminPassword.trim()) {
      Alert.alert("오류", "새 비밀번호를 입력해주세요.");
      return;
    }

    // Firebase에 새 관리자 비밀번호 저장
    const adminPasswordRef = ref(database, "adminPassword");
    update(adminPasswordRef, { adminPassword: newAdminPassword }).then(() => {
      setAdminPassword(newAdminPassword); // 로컬 상태 업데이트
      setChangePasswordModalVisible(false); // 모달 닫기
      Alert.alert("성공", "관리자 비밀번호가 변경되었습니다.");
      setCurrentAdminPassword(""); // 입력 필드 초기화
      setNewAdminPassword("");
    });
  };

  // 게시글 읽기
  useEffect(() => {
    const postsRef = ref(database, "posts/");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedPosts = Object.keys(data)
          .map((key) => ({
            id: key,
            username: data[key].username,
            password: data[key].password,
            title: data[key].title,
            content: data[key].content,
            timestamp: data[key].timestamp,
          }))
          .sort((a, b) => b.timestamp - a.timestamp); // 최신순 정렬
        setPosts(formattedPosts);
      } else {
        setPosts([]);
      }
    });
  }, []);

  // 댓글 읽기
  useEffect(() => {
    if (selectedPost) {
      const commentsRef = ref(database, `comments/${selectedPost.id}`);
      onValue(commentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedComments = Object.keys(data).map((key) => ({
            id: key,
            username: data[key].username,
            password: data[key].password,
            content: data[key].content,
          }));
          setComments(formattedComments);
        } else {
          setComments([]);
        }
      });
    }
  }, [selectedPost]);

  // 게시글 추가
  const addPost = () => {
    if (username.trim() && password.trim() && title.trim() && content.trim()) {
      const postsRef = ref(database, "posts/");
      push(postsRef, { username, password, title, content, timestamp: Date.now() });
      setUsername("");
      setPassword("");
      setTitle("");
      setContent("");
      setListVisiable(true);
      setContentVisiable(false);
    } else {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
    }
  };

  // 게시글 삭제
  const handleDeletePost = (post) => {
    setTargetPost(post);
    setActionType("delete");
    setPasswordModalVisible(true);
  };

  const deletePost = () => {
    if (passwordInput === targetPost.password || passwordInput === adminPassword) {
      remove(ref(database, `posts/${targetPost.id}`)); // 게시글 삭제
      remove(ref(database, `comments/${targetPost.id}`)); // 연결된 댓글 삭제
      setSelectedPost(null);
      setPasswordModalVisible(false);
      setPasswordInput("");
    } else {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
    }
  };

  // 게시글 수정
  const handleEditPost = (post) => {
    setTargetPost(post);
    setActionType("edit");
    setPasswordInput("");
    setPasswordModalVisible(true);
  };
  // 비밀번호 확인 후 수정 Modal 표시
  const confirmEditPost = () => {
    if (passwordInput === targetPost.password || passwordInput === adminPassword) {
      setEditTitle(targetPost.title);
      setEditContent(targetPost.content);
      setPasswordModalVisible(false); // 비밀번호 입력 모달 닫기
      setEditModalVisible(true); // 수정 모달 열기
    } else {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
    }
  };

  // 게시글 수정 완료
  const submitEditPost = () => {
    if (editTitle.trim() && editContent.trim()) {
      update(ref(database, `posts/${targetPost.id}`), {
        title: editTitle,
        content: editContent,
      });
      setEditModalVisible(false); // 수정 모달 닫기
      setTargetPost(null); // 선택된 게시글 초기화
    } else {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
    }
  };

  // 댓글 추가
  const addComment = () => {
    if (commentUsername.trim() && commentPassword.trim() && commentContent.trim()) {
      const commentsRef = ref(database, `comments/${selectedPost.id}`);
      push(commentsRef, { username: commentUsername, password: commentPassword, content: commentContent });
      setCommentUsername("");
      setCommentPassword("");
      setCommentContent("");
    } else {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = (comment) => {
    setTargetPost(comment);
    setActionType("deleteComment");
    setPasswordModalVisible(true);
  };

  const deleteComment = () => {
    if (passwordInput === targetPost.password || passwordInput === adminPassword) {
      remove(ref(database, `comments/${selectedPost.id}/${targetPost.id}`));
      setPasswordModalVisible(false);
      setPasswordInput("");
    } else {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
    }
  };

  const [listVisiable, setListVisiable] = useState(true);
  const [contentVisiable, setContentVisiable] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.LOAHUBButton}>
        <Link
          href='../../List'>
          <Text style={{ fontSize: 50, color: '#F7F7F0' }}>LOAHUB</Text>
        </Link>
      </TouchableOpacity>
      {/* 관리자 비밀번호 변경 버튼 */}
      {listVisiable && (
        <TouchableOpacity onPress={() => setChangePasswordModalVisible(true)}>
          <Text style={styles.text}>게시판 관리</Text>
        </TouchableOpacity>)}

      {/* 관리자 비밀번호 변경 Modal */}
      <Modal visible={isChangePasswordModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.modalTitle}>관리자 비밀번호 변경</Text>
            <TextInput
              style={styles.input}
              placeholder="현재 비밀번호"
              placeholderTextColor='#F7F7F0'
              secureTextEntry
              value={currentAdminPassword}
              onChangeText={setCurrentAdminPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="새 비밀번호"
              placeholderTextColor='#F7F7F0'
              secureTextEntry
              value={newAdminPassword}
              onChangeText={setNewAdminPassword}
            />
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <TouchableOpacity 
                style={styles.save}
                onPress={changeAdminPassword}>
                <Text style={styles.text}>비밀번호 변경</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancel}
                onPress={() => setChangePasswordModalVisible(false)}>
                <Text style={styles.text}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {listVisiable && (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={styles.title}>게시글 목록</Text>
          <TouchableOpacity onPress={() => { setListVisiable(false); setContentVisiable(true); setSelectedPost(null); }}>
            <Text style={styles.text}>게시글 작성</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 게시글 목록 */}
      {listVisiable && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          nestedScrollEnabled={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.post}
              onPress={() => setSelectedPost(item)}
            >
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postUsername}>작성자: {item.username}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* 게시글 입력 */}
      {contentVisiable && (
        <View style={styles.inputContainer}>
          <Text style={styles.title}>게시글 작성</Text>
          <TextInput
            style={styles.input}
            placeholder="사용자 이름"
            placeholderTextColor='#F7F7F0'
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor='#F7F7F0'
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="제목"
            placeholderTextColor='#F7F7F0'
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="내용"
            placeholderTextColor='#F7F7F0'
            value={content}
            onChangeText={setContent}
            multiline
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={styles.save}
              onPress={() => { addPost(); }} >
              <Text style={styles.text}>완료</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancel}
              onPress={() => { setListVisiable(true); setContentVisiable(false); }}>
              <Text style={styles.text}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 게시글 세부 보기 및 댓글 */}
      {selectedPost && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedPost}
          statusBarTranslucent={true}
          onRequestClose={() => {
            setSelectedPost(null);
            setComments([]);
          }}
        >
          {/* 비밀번호 입력 Modal */}
          <Modal visible={isPasswordModalVisible} transparent={true} animationType="slide" >
            <View style={styles.modalContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.text}>비밀번호를 입력하세요:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호"
                  placeholderTextColor='#F7F7F0'
                  secureTextEntry
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                />
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <TouchableOpacity
                  style={styles.save}
                  onPress={() => {
                    if (actionType === "edit") confirmEditPost();
                    if (actionType === "delete") deletePost();
                    if (actionType === "deleteComment") deleteComment();
                  }}>
                  <Text style={styles.text}>확인</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancel}
                  onPress={() => setPasswordModalVisible(false)}>
                  <Text style={styles.text}>취소</Text>
                </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* 게시글 수정 Modal */}
          <Modal visible={isEditModalVisible} transparent={true} animationType="slide">

            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.text}>게시글 수정</Text>
                <TextInput
                  style={styles.input}
                  placeholder="제목"
                  placeholderTextColor='#F7F7F0'
                  value={editTitle}
                  onChangeText={setEditTitle}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="내용"
                  placeholderTextColor='#F7F7F0'
                  value={editContent}
                  onChangeText={setEditContent}
                  multiline
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity 
                  style={styles.save}
                  onPress={submitEditPost}>
                  <Text style={styles.text}>저장</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancel}
                  onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.text}>취소</Text>
                </TouchableOpacity>
                </View>
              </View>
            </View>

          </Modal>
          <ScrollView style={styles.container}>
            <TouchableOpacity
              onPress={() => setSelectedPost(false)}>
              <Text style={styles.text}>뒤로가기</Text>
            </TouchableOpacity>
            <SafeAreaView>
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginBottom: 50 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 10 }}>
                    <Text style={styles.postTitle}>{selectedPost.title}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity 
                        style={styles.save}
                        onPress={() => handleEditPost(selectedPost)}>
                        <Text style={styles.textSaveCancel}>수정 </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.cancel}
                        onPress={() => handleDeletePost(selectedPost)}>
                        <Text style={styles.textSaveCancel}> 삭제</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.text}>작성자: {selectedPost.username}</Text>
                  <Text style={styles.text}>{selectedPost.content}</Text>
                </View>
                {/* 댓글 목록 */}
                <View>
                  <View>
                    <FlatList
                      data={comments}
                      keyExtractor={(item) => item.id}
                      nestedScrollEnabled={true}
                      renderItem={({ item }) => (
                        <View style={styles.comment}>
                          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={styles.commentUsername}>
                              {item.username}:
                            </Text>
                            {/* 댓글 삭제 버튼 */}
                            <TouchableOpacity 
                            style={styles.cancel}
                            onPress={() => handleDeleteComment(item)}>
                            <Text style={styles.textSaveCancel}>삭제</Text>
                          </TouchableOpacity>
                          </View>
                          <Text style={styles.text}>{item.content}</Text>
                        </View>
                      )}
                    />
                  </View>
                  {/* 댓글 입력 */}
                  <View style={styles.inputContainer}>
                    <View>
                      <TextInput
                        style={styles.input}
                        placeholder="닉네임"
                        placeholderTextColor='#F7F7F0'
                        value={commentUsername}
                        onChangeText={setCommentUsername}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="비밀번호"
                        placeholderTextColor='#F7F7F0'
                        secureTextEntry
                        value={commentPassword}
                        onChangeText={setCommentPassword}
                      />
                    </View>
                    <View>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="댓글 내용"
                        placeholderTextColor='#F7F7F0'
                        value={commentContent}
                        onChangeText={setCommentContent}
                        multiline
                      />
                    </View>
                    <TouchableOpacity
                      style={{ alignItems: 'flex-end' }}
                      onPress={addComment}>
                      <Text style={styles.text}>댓글 추가</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={{ marginBottom: 50 }}
                    onPress={() => setSelectedPost(false)}>
                    <Text style={styles.text}>뒤로가기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </Modal>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#151720'
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#F7F7F0',
  },
  inputContainer: {
    backgroundColor: '#151720',
    width: '100%',
    padding: 10,
    borderStyle: 'solid',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F7F7F0',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#F7F7F0',
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  post: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    color: '#F7F7F0',
  },
  postTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: '#F7F7F0',
  },
  postUsername: {
    fontSize: 14,
    color: '#F7F7F0',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경을 반투명하게 설정 (옵션)
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151720',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#F7F7F0',
  },
  modalUsername: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    color: '#F7F7F0',
  },
  modalContentText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#F7F7F0',
  },
  comment: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
    color: '#F7F7F0',
  },
  commentUsername: {
    fontWeight: "bold",
    color: '#F7F7F0',
  },
  LOAHUBButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#F7F7F0',
    fontSize: 20
  },
  textSaveCancel:{
    color: '#F7F7F0',
    fontSize: 15
  },
  save: {
    backgroundColor: 'blue',
    borderRadius: 8, 
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    backgroundColor: 'red', 
    borderRadius: 8, 
    padding: 3,
    alignItems:'center',
    justifyContent: 'center',
  },
});
