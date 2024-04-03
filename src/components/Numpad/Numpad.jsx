import PropTypes from 'prop-types';
import styles from "./Numpad.module.css";

function Numpad({ activeIdx }) {
    const content = [];

    for (let i = 0; i < 9; i++) {
        let className;

        if (i === activeIdx) {
            className = styles.active;
        }

        content.push(<div key={i} className={className}></div>);
    }

    return (
        <div className={styles.grid}>
            {content} 
        </div>
    );
}

Numpad.propTypes = {
    activeIdx: PropTypes.number
};

export default Numpad;