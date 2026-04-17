//src/components/molecules/ButtonCollection.jsx
// This component is designed to render a collection of LogoButtons in  a horizontal layout with consistent spacing
import { LogoButton } from '../atoms/LogoButton';

export function ButtonCollection({ buttons }) {
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