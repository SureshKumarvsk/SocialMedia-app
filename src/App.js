import { Routes,Route,useNavigate } from 'react-router-dom';
import api from './api/newFile'
import About from './About';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Missing from './Missing';
import Nav from './Nav';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from './EditPost';

import { useEffect, useState } from 'react';
import {format} from "date-fns";


function App() {
  const [search,setSearch] = useState('')
  const [postBody,setPostBody] =useState('')
  const [postTitle,setPostTitle] =useState('')
  const [searchResult,setsearchResult]=useState([])
  const navigate = useNavigate()
  const [editbody,setEditBody] =useState('')
  const [editTitle,setEditTitle] =useState('')
  const [posts,setPosts] =useState([
   
  ])
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);

      
      } catch (err) {
        if (err.message) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };

    fetchPosts();
  }, []);
 useEffect(() => {
  const filterResults = posts.filter((post) => {
    const lowercaseBody = post.body?.toLowerCase() || '';  // Check if body is defined
    const lowercaseTitle = post.title?.toLowerCase() || ''; // Check if title is defined

    return (
      lowercaseBody.includes(search.toLowerCase()) ||
      lowercaseTitle.includes(search.toLowerCase())
    );
  });

  setsearchResult(filterResults.reverse());
}, [posts, search]);


const handleEdit= async (id)=>{
   const datetime = format(new Date(),'MMMM dd,yyyypp');
  const updatePost ={id,title:editTitle,datetime,body:editbody}
  try{
    const response = await api.put(`/posts/${id}`,updatePost)
    setPosts(posts.map(post => post.id===id ?{...response.data} : post));
    setEditTitle('')
    setEditBody('')
    navigate('/')
  }
  catch(err){
    if(err.message){
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    }
    else{
      console.log(`Error : ${err.message}`);
    }
  }

}





    const handleSubmit= async (e)=>{
      e.preventDefault();
      const id= posts.length ? posts[posts.length -1].id + 1 : 1;
      const datetime = format(new Date(),'MMMM dd,yyyypp');
      const newPost ={id,title:postTitle,datetime,body:postBody}
      try{
        const response = await api.post('/posts',newPost)
        const allPosts =[...posts,response.data]
        setPosts(allPosts)
        setPostTitle('')
        setPostBody('')
        navigate('/')
      }
      catch(err){
        if(err.message){
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        }
        else{
          console.log(`Error : ${err.message}`);
        }
      }

    }
    
  const  handleDelete=async (id)=>  {
    console.log('deleting id',id)
    try{
      await api.delete(`/posts/${id}`)
      const postsList =posts.filter(post =>post.id !==id)
      setPosts(postsList)
      navigate('/')

    }
    catch(err){
      console.log(`Error ${err.message}`)
    }
    
  }
  
  return(
    <div className='App'>
      <Header title="social media App" />
      <Nav
        search={search}
        setSearch={setSearch} />
     <Routes>
 
  <Route path='/' element={<Home posts={searchResult} />} />
  <Route path='post'>
    <Route index element={<NewPost
      postTitle={postTitle}
      postBody={postBody}
      setPostBody={setPostBody}
      setPostTitle={setPostTitle}
      handleSubmit={handleSubmit} />} />
      
    <Route path=':id' element={<PostPage posts={posts} handleDelete={handleDelete} />} />
  </Route>
  <Route  path='/edit/:id' element={<EditPost 
      posts={posts}
      handleEdit={handleEdit}
      editBody={editbody}
      setEditBody={setEditBody}
      editTitle={editTitle}
      setEditTitle={setEditTitle}
      />}/>
  <Route path='about' element={<About />} />
  <Route path='*' element={<Missing />} />
</Routes>

    <Footer />
    </div>
  )


}

export default App;
