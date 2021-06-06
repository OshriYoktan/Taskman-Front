import { Widget } from 'react-cloudinary-upload-widget'
import { useDispatch, useSelector } from 'react-redux'
import boardService from '../../services/boardService'
import { utilService } from '../../services/utilService'
import { saveBoard, setCurrBoard } from '../../store/actions/boardActions'
import './Cloudinary.scss'

export function Cloudinary({ type, txt, currTask, currCard, setCloudImgs }) {
    const dispatch = useDispatch()
    const currBoard = useSelector(state => state.boardReducer.currBoard)

    const onAttAdd = (res) => {
        console.log('res:', res)
        if (type === 'cover') {
            currTask.cover = res.info.secure_url
            const newBoard = boardService.updateCard(currTask, currCard, currBoard)
            dispatch(saveBoard(newBoard))
            dispatch(setCurrBoard(newBoard._id))
        }
        else if (type === 'background') {
            currBoard.images.unshift(res.info.secure_url)
            setCloudImgs(currBoard.images)
            dispatch(saveBoard(currBoard))
            dispatch(setCurrBoard(currBoard._id))
        }
        else {
            var newAtt = { _id: utilService.makeId(), title: res.info.original_filename, src: res.info.secure_url }
            currTask.attachments.push(newAtt)
        }
    }

    return (
        <section className="cloudinary-container">
            <Widget
                sources={['local', 'camera', 'url', 'dropbox', 'instagram', 'search_web']}
                sourceKeys={{ dropboxAppKey: 'idwo4j2egt6411m', instagramClientId: '14c890ce047a8defd4410d4bd0b1d823' }}
                resourceType={'image'}
                cloudName={'dtu0lzwpw'}
                uploadPreset={'aywupxtw'}
                buttonText={txt || 'Attachments'}
                style={{
                    color: 'inherit',
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'inherit',
                    borderRadius: '4px',
                    padding: 0
                }}
                folder={'taskman'}
                onSuccess={onAttAdd}
                onFailure={err => console.log(err)}
                logging={false}
                customPublicId={'sample'}
                eager={'w_400,h_300,c_pad|w_260,h_200,c_crop'}
                use_filename={true}
                unique_filename={true}
                apiKey={639164948471337}
                accepts={'application/json'}
                contentType={'application/json'}
                withCredentials={true}
            />
        </section>
    )
}