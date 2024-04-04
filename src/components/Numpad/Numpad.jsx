import PropTypes from 'prop-types';
import styles from "./Numpad.module.css";

function Numpad({ activeIdx }) {
    const cells = [];

    for (let i = 0; i < 9; i++) {
        let className;

        if (i === activeIdx - 1) {
            className = styles.active;
        }

        cells.push(<div key={i} className={className}></div>);
    }

    return (
        <div className={styles.grid}>
            {cells} 
        </div>
    );
}

Numpad.propTypes = {
    activeIdx: PropTypes.number
};

export default Numpad;