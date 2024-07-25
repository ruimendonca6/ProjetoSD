
CREATE TABLE user (
    user        VARCHAR(100),
    password    VARCHAR(255),
    roles       VARCHAR(255), 
    created_on  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_on  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE HistoricalEvent (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    date         VARCHAR(255) NOT NULL,
    description  VARCHAR(255) NOT NULL,
    lang         VARCHAR(50) NOT NULL,
    category1    VARCHAR(100) NOT NULL,
    category2    VARCHAR(100) NOT NULL,
    granularity  VARCHAR(50) NOT NULL,
    createdAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


