import {initializeApp} from "firebase/app"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import {upload} from 'scripts/upload'
import {firebaseConfig} from "scripts/firebaseConfig";

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

upload('#file', {
    multi: true,
    accept:['.png','.jpg','.jpeg','.gif'],
    onUpload(files, blocks){
        files.forEach((file, index) => {
          const storageRef = ref(storage, `images/${file.name}`)
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on('state_changed', 
          (snapshot) => {            
            const progress =((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
            const blocksSelector = blocks[index].querySelector('.preview-info-progress')
             blocksSelector.textContent = progress
             blocksSelector.style.width = progress
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break;
              case 'running':
                console.log('Upload is running')
                break;
            }
          }, 
          (error) => {
            console.log(error)
          }, 
          () => {           
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

              console.log('Файл доступен по ссылке ', downloadURL)
            });
          }
        );
        })
    }
})

