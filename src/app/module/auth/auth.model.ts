import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('token_auth')
export class TokenAuth {
    @PrimaryColumn('uuid')
    user_id: string;

    @Column({ type: 'text', nullable: false })
    refresh_token: string;

    @Column({ type: 'varchar', nullable: false })
    ip_address: string;
}