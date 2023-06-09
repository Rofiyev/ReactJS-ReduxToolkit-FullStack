import { useRef, useState,useCallback } from 'react'
import Form from '../ui/Form';
import ArticleService from '../service/article';
import { postArticleFailure, postArticleStart, postArticleSuccess, reset } from '../slice/article';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Toastfiy from './Toastfiy';

const CreateArticle = () => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const { error } = useSelector(state => state.article);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [description, setDescription] = useState('');

  // Alert
  const errorMessege = useCallback(() => {
    if (error !== null) {
      return Object.keys(error).map(name => {
        const msg = error[name]?.join(', ');
        return `${name.charAt(0).toUpperCase() + name.slice(1)} - ${msg}`;
      })
    }
  }, [error]);
  // 

  const formSubmit = async (e) => {
    e.preventDefault();
    dispatch(postArticleStart())
    const { body, title, description } = ref.current;
    const data = {
      body: body.value,
      title: title.value,
      description: description.value,
    }

    dispatch(reset());
    try {
      await ArticleService.postArticle(data);
      dispatch(postArticleSuccess());
      setAlert(true);
      setErrorAlert(false);
      setTimeout(() => { navigate('/') }, 500);
      ref.current.reset();
    } catch (error) {
      setAlert(false);
      setErrorAlert(true);
      dispatch(postArticleFailure(error.response.data.errors));
    }
  }

  return (
    <div className='container'>
      <h2 className='text-center mt-5 fw-bold'>Create Article</h2>
      <div className='d-none'>
        <>
          {alert && <Toastfiy color={'#008554'} messege={'Create Article Successfully'} />}
          {errorAlert && <Toastfiy color={'#ea0229'} messege={errorMessege()[0]} />}
        </>
      </div>
      <div className="row mt-5">
        <div className="col-md-8 mx-auto">
          <Form refForm={ref} onSubmit={formSubmit} state={{ title, body, description, setTitle, setBody, setDescription }} />
        </div>
      </div>
    </div>
  )
}

export default CreateArticle;