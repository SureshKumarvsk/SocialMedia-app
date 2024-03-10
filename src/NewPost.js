import React from 'react'

const NewPost = ({handleSubmit,postTitle,setPostTitle,postBody,setPostBody}) => {
  return (
    <main className='NewPost'>
        <h2>New Post</h2>
        <form className='newPostForm' onSubmit={handleSubmit}>
            <label htmlFor="postTitle">Ttle:</label>
            <input 
                id='postTitle'
                type="text" 
                required
                value={postTitle}
                onChange={(e)=>setPostTitle(e.target.value)}
            />
            <label htmlFor="postbody">Post:</label>
            <textarea
              id='postbody'
               required
                value={postBody}
                onChange={(e)=>setPostBody(e.target.value)}
            
            />
                
                <button type='submit' >Submit</button>
          
        </form>
        
    </main>
  )
}

export default NewPost