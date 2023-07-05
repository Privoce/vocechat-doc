import React from 'react'

type Props = {
    images: {
        title?: string,
        src: string
    }[]
}

const InlineImages = ({ images }: Props) => {
    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
        }}>
            {images.map((image, index) => (
                <img key={image.src} src={image.src} alt={image.title} />
            ))}

        </div>
    )
}

export default InlineImages