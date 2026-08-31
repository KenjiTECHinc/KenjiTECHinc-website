//src/components/molecules/ButtonCollection.tsx
// This component is designed to render a collection of LogoButtons in  a horizontal layout with consistent spacing
import { LogoButton } from '../atoms/LogoButton';
import type { ConnectButton } from '../../types';

interface ButtonCollectionProps {
    buttons: ConnectButton[];
}

export function ButtonCollection({ buttons }: ButtonCollectionProps) {
    const buttonsFlat = buttons.flat();

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-2 mb-2">
            {buttonsFlat.map((button, index) => (
                <LogoButton
                    key={index}
                    href={button.url}
                    name={button.name}
                >
                    {button.message}
                </LogoButton>
            ))}
        </div>
    );
}