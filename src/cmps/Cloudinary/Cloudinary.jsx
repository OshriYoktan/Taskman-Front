import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'
import './Cloudinary.scss'

export function Cloudinary() {
    const successCallBack = (res) => {
        console.log('res:', res)
    }

    const failureCallBack = (err) => {
        console.log('err:', err)
    }

    return (
        <div className="cloudinary-container">
            <WidgetLoader />
            <Widget
                sources={['local', 'camera', 'url', 'dropbox', 'instagram']}
                sourceKeys={{ dropboxAppKey: 'idwo4j2egt6411m', instagramClientId: '14c890ce047a8defd4410d4bd0b1d823' }}
                resourceType={'image'}
                cloudName={'dtu0lzwpw'}
                uploadPreset={'aywupxtw'}
                buttonText={'Attachments'}
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
                onSuccess={successCallBack}
                onFailure={failureCallBack}
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
        </div>
    )
}
