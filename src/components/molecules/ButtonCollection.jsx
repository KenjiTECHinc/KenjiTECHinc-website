//src/components/molecules/ButtonCollection.jsx
// This component is designed to render a collection of LogoButtons in  a horizontal layout with consistent spacing
import { LogoButton } from '../atoms/LogoButton';

export function ButtonCollection({ buttons }) {
    const buttonsFlat = buttons.flat();

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-2 mb-2">
            {buttonsFlat.map(button => (
                <LogoButton
                    href={button.url}
                    iconName={button.iconName}
                    altText={button.name}
                    colorVariant={button.colorVariant}
                >
                    {button.message}
                </LogoButton>
            ))}
        </div>
    );
}